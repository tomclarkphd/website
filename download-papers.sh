#!/bin/bash
# Downloads all paper PDFs from Squarespace into the /files directory.
# Run once from the repo root: bash download-papers.sh

set -e
mkdir -p files

URLS=(
  "https://www.tomclarkphd.com/s/ClarkParryAgendaSetting.pdf"
  "https://www.tomclarkphd.com/s/modelOfJustice.pdf"
  "https://www.tomclarkphd.com/s/coordinatedProsecution2603.pdf"
  "https://www.tomclarkphd.com/s/police_insurance.pdf"
  "https://www.tomclarkphd.com/s/chargeStacking.pdf"
  "https://www.tomclarkphd.com/s/Minority_Will_.pdf"
  "https://www.tomclarkphd.com/s/729933.pdf"
  "https://www.tomclarkphd.com/s/SchiffEtAlJEPS2023.pdf"
  "https://www.tomclarkphd.com/s/ClarkEtAlJOP2023.pdf"
  "https://www.tomclarkphd.com/s/scourt.pdf"
  "https://www.tomclarkphd.com/s/BeimClarkLauderdaleJOP.pdf"
  "https://www.tomclarkphd.com/s/Why_Are_Pandemics_Ideological_.pdf"
  "https://www.tomclarkphd.com/s/OIS_and_Contact-zzlc.pdf"
  "https://www.tomclarkphd.com/s/4624email.pdf"
  "https://www.tomclarkphd.com/s/CanesWroneClarkSemet.pdf"
  "https://www.tomclarkphd.com/s/CourtOMeterPaperv5-npsf.pdf"
  "https://www.tomclarkphd.com/s/SequentialAdjudication-FinalSubmit.pdf"
  "https://www.tomclarkphd.com/s/CallanderClarkAPSR2017.pdf"
  "https://www.tomclarkphd.com/s/LauderdaleClarkJOP2016.pdf"
  "https://www.tomclarkphd.com/s/ClarkJTP2015.pdf"
  "https://www.tomclarkphd.com/s/ClarkStatonJOP2015.pdf"
  "https://www.tomclarkphd.com/s/ClarkLinzerPSRM2015.pdf"
  "https://www.tomclarkphd.com/s/ClarkKastellecAPR2015.pdf"
  "https://www.tomclarkphd.com/s/ClarkLaxRiceJLC2015.pdf"
  "https://www.tomclarkphd.com/s/CanesWroneClarkKellyAPSR2014.pdf"
  "https://www.tomclarkphd.com/s/LauderdaleClarkAJPS2014.pdf"
  "https://www.tomclarkphd.com/s/ClarkKastellecJOP2013-amm6.pdf"
  "https://www.tomclarkphd.com/s/LauderdaleClarkAPSR2012.pdf"
  "https://www.tomclarkphd.com/s/CarrubbaClarkAPSR2012.pdf"
  "https://www.tomclarkphd.com/s/ClarkLauderdalePA2012.pdf"
  "https://www.tomclarkphd.com/s/ClarkCarrubbaJOP2012.pdf"
  "https://www.tomclarkphd.com/s/CanesWroneClarkParkJLEO2012.pdf"
  "https://www.tomclarkphd.com/s/ClarkLauderdaleAJPS2010.pdf"
  "https://www.tomclarkphd.com/s/ClarkStraussJTP2010.pdf"
  "https://www.tomclarkphd.com/s/ClarkAJPS2009.pdf"
  "https://www.tomclarkphd.com/s/CanesWroneClarkWLR2009-8hws.pdf"
)

for url in "${URLS[@]}"; do
  filename=$(basename "$url")
  echo "Downloading $filename..."
  curl -sL -o "files/$filename" "$url"
  size=$(wc -c < "files/$filename")
  if [ "$size" -gt 1000 ]; then
    echo "  ✓ ${size} bytes"
  else
    echo "  ✗ FAILED (only ${size} bytes)"
  fi
done

echo ""
echo "Done. $(ls files/*.pdf | wc -l) PDF files in /files."
