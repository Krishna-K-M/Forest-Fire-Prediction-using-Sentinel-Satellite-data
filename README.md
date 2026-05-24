# Forest Fire Prediction using Google Earth Engine and Machine Learning

## Overview

This project focuses on forest fire prediction and burned area analysis using satellite imagery, remote sensing techniques, and machine learning within Google Earth Engine (GEE).

The system analyzes pre-fire and post-fire satellite data to identify burned regions and generate fire probability maps using environmental and spectral features.

---

## Features

- Forest fire prediction using machine learning
- Burned area detection using satellite imagery
- Google Earth Engine integration
- NDVI and dNBR analysis
- Sentinel-1 and Sentinel-2 data processing
- Random Forest classification
- Fire probability mapping
- Remote sensing workflow automation

---

## Technologies Used

- Google Earth Engine (GEE)
- JavaScript
- Remote Sensing
- Sentinel-1 SAR
- Sentinel-2 MSI
- Machine Learning
- Random Forest Classifier

---

## Data Sources

This project uses geospatial datasets directly from Google Earth Engine collections including:

- Sentinel-1 SAR
- Sentinel-2 MSI
- JRC Global Surface Water Dataset

Due to the large size of geospatial raster exports and satellite imagery,
the complete dataset is not included in this repository.

The project can be reproduced using the provided Google Earth Engine scripts.

---

## Project Structure

```text
forest-fire-prediction/
│
├── gee/
│   └── fire_prediction.js
│
├── outputs/
│   ├── ConfusionMatrix.png
│   ├── FireMap.png
│   └── StudyArea.png
├── README.md
```

---

## How to Run the Project in Google Earth Engine

### Step 1 — Create a Google Earth Engine Account

Register at:

https://earthengine.google.com/

---

### Step 2 — Open Google Earth Engine Code Editor

Open:

https://code.earthengine.google.com/

---

### Step 3 — Upload the Script

Copy the contents of:

```text
fire_prediction.js
```

Paste it into the Google Earth Engine Code Editor.

---

### Step 4 — Run the Script

Click the **Run** button in the GEE editor.

The script will:

- Load Sentinel satellite datasets
- Process vegetation and burn indices
- Generate burned area maps
- Train the Random Forest model
- Display fire probability outputs

---

### Step 5 — Visualize Results

Generated layers can be viewed directly in the Earth Engine map interface.

Optional exports can be created using:

```javascript
Export.image.toDrive()
```

for downloading raster outputs to Google Drive.

---

## Workflow

1. Collect Sentinel satellite imagery
2. Preprocess satellite datasets
3. Generate vegetation and burn indices
4. Extract fire-related features
5. Train Random Forest classifier
6. Generate fire probability maps
7. Visualize burned areas and prediction results

---

## Spectral Indices Used

### NDVI (Normalized Difference Vegetation Index)

Used for vegetation health monitoring.

### dNBR (Difference Normalized Burn Ratio)

Used for burned area assessment and fire severity mapping.

---

## Machine Learning Model

This project uses a Random Forest classifier for forest fire prediction based on:

- Spectral indices
- Vegetation characteristics
- Burn severity metrics
- Satellite-derived features

---

## Output Results

The project generates:

- Burned area maps
- Fire probability maps
- Vegetation analysis maps
- Satellite visualization outputs

Sample outputs are available in the `outputs/` directory.

---

## Applications

- Forest monitoring
- Wildfire risk assessment
- Environmental analysis
- Disaster management
- Remote sensing research

---

## Future Improvements

- Real-time wildfire monitoring
- Deep learning integration
- Weather data integration
- Web-based visualization dashboard
- Higher-resolution prediction system

---

## Author

Krishna K M
