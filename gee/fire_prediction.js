// ================================================================
// Forest Fire Detection — FINAL 
// Western Ghats 
// ================================================================


// 1. AOI (Western Ghats)

var aoi = ee.Geometry.Polygon([
  [[72.5, 21.5],
   [78.5, 21.5],
   [77.5, 8.0],
   [73.0, 8.0]]
]);
Map.centerObject(aoi, 6);


// 2. WATER MASK

var water = ee.Image('JRC/GSW1_4/GlobalSurfaceWater')
              .select('occurrence');
var landMask = water.lt(50);

// 3. SENTINEL-2

function maskS2(image) {
  var scl = image.select('SCL');
  var mask = scl.eq(4).or(scl.eq(5)).or(scl.eq(6))
               .or(scl.eq(7)).or(scl.eq(11));
  return image.updateMask(mask).divide(10000);
}

var s2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED');

var pre = s2.filterBounds(aoi)
  .filterDate('2023-01-01','2023-03-31')
  .map(maskS2)
  .median()
  .clip(aoi)
  .updateMask(landMask);

var post = s2.filterBounds(aoi)
  .filterDate('2023-04-01','2023-06-30')
  .map(maskS2)
  .median()
  .clip(aoi)
  .updateMask(landMask);


// 4. INDICES

var ndvi = post.normalizedDifference(['B8','B4']).rename('NDVI');
var ndvi_pre = pre.normalizedDifference(['B8','B4']);
var ndvi_diff = ndvi_pre.subtract(ndvi).rename('NDVI_diff');

var nbr_pre = pre.normalizedDifference(['B8','B12']);
var nbr_post = post.normalizedDifference(['B8','B12']);
var dNBR = nbr_pre.subtract(nbr_post).rename('dNBR');

var nbr = nbr_post.rename('NBR');
var swir = post.select('B12').rename('SWIR');


// 5. SENTINEL-1

var s1 = ee.ImageCollection('COPERNICUS/S1_GRD')
  .filterBounds(aoi)
  .filterDate('2023-04-01','2023-06-30')
  .filter(ee.Filter.eq('instrumentMode', 'IW'))
  .select(['VV','VH'])
  .median()
  .clip(aoi)
  .updateMask(landMask);

var vv = s1.select('VV').rename('VV');
var vh = s1.select('VH').rename('VH');


// 6. FEATURE STACK

var featuresImg = post.select('B4').rename('RED')
  .addBands(post.select('B8').rename('NIR'))
  .addBands(swir)
  .addBands(ndvi)
  .addBands(nbr)
  .addBands(ndvi_diff)
  .addBands(vv)
  .addBands(vh);


// 7. LABEL 

var label = ee.Image(0)
  .where(dNBR.gt(0.3), 1)
  .where(dNBR.lt(0.05), 0)
  .rename('label');

var validMask = dNBR.gt(0.3).or(dNBR.lt(0.05));
label = label.updateMask(validMask);


// 8. STACK

var stack = featuresImg.addBands(label);


// 9. STRATIFIED SAMPLING

var samples = stack.stratifiedSample({
  numPoints: 6000,
  classBand: 'label',
  region: aoi,
  scale: 100,
  classValues: [0, 1],
  classPoints: [3000, 3000],
  seed: 42,
  geometries: true,
  dropNulls: true,
  tileScale: 8
});

print('Samples:', samples.size());
print('Distribution:', samples.aggregate_histogram('label'));


// 10. TRAIN / TEST SPLIT

var withRandom = samples.randomColumn('random');

var train = withRandom.filter(ee.Filter.lt('random', 0.7));
var test  = withRandom.filter(ee.Filter.gte('random', 0.7));


// 11. RANDOM FOREST

var rf = ee.Classifier.smileRandomForest({
  numberOfTrees: 150,
  minLeafPopulation: 5,
  bagFraction: 0.8,
  seed: 42
}).train({
  features: train,
  classProperty: 'label',
  inputProperties: [
    'RED','NIR','SWIR',
    'NDVI','NBR','NDVI_diff',
    'VV','VH'
  ]
});


// 12. PREDICTION

var prediction = featuresImg.classify(rf);

// SMOOTHING
prediction = prediction
  .focal_mode(150, 'circle', 'meters')
  .focal_max(75, 'circle', 'meters');

prediction = prediction.updateMask(landMask);


// 13. PROBABILITY MAP

var prob = featuresImg.classify(
  rf.setOutputMode('PROBABILITY')
);

prob = prob.updateMask(landMask);


// 14. ACCURACY

var test_classified = test.classify(rf);
var cm = test_classified.errorMatrix('label','classification');

print('Confusion Matrix:', cm);
print('Accuracy:', cm.accuracy());
print('Kappa:', cm.kappa());


// 15. FIRE ZONES

var fireZones = prob.gt(0.6);

Map.addLayer(fireZones,
  {palette:['red']},
  'High Fire Risk');


// 16. VISUALIZATION

Map.addLayer(prediction,
  {min:0, max:1, palette:['#2ca25f','#FF4136']},
  'Fire Prediction');

Map.addLayer(prob,
  {min:0, max:1, palette:['green','yellow','red']},
  'Fire Probability');

Map.addLayer(dNBR,
  {min:-0.5, max:1, palette:['green','yellow','red']},
  'dNBR');