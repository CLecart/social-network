#!/usr/bin/env bash
# Build PDF du dossier de certification RNCP 37873
# Usage: ./build-pdf.sh [output.pdf]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUTPUT="${1:-$SCRIPT_DIR/Dossier_RNCP_37873_Lecart.pdf}"

# Puppeteer sans sandbox (AppArmor Ubuntu)
export MERMAID_FILTER_PUPPETEER_CONFIG="$SCRIPT_DIR/../.puppeteer.json"
# Assure que pandoc-latex-environment est dans le PATH
export PATH="$HOME/.local/bin:$PATH"

# Crée le fichier puppeteer si absent
if [ ! -f "$SCRIPT_DIR/../.puppeteer.json" ]; then
  echo '{"args":["--no-sandbox","--disable-setuid-sandbox"]}' \
    > "$SCRIPT_DIR/../.puppeteer.json"
fi

echo "→ Build PDF : $OUTPUT"

pandoc \
  "$SCRIPT_DIR/00-presentation/README.md" \
  "$SCRIPT_DIR/01-introduction/README.md" \
  "$SCRIPT_DIR/02-cahier-des-charges/README.md" \
  "$SCRIPT_DIR/03-conception/README.md" \
  "$SCRIPT_DIR/03-conception/user-stories.md" \
  "$SCRIPT_DIR/03-conception/donnees.md" \
  "$SCRIPT_DIR/03-conception/diagrammes-uml.md" \
  "$SCRIPT_DIR/04-developpement/README.md" \
  "$SCRIPT_DIR/04-developpement/securite-rgpd.md" \
  "$SCRIPT_DIR/04-developpement/tests-strategy.md" \
  "$SCRIPT_DIR/04-developpement/veille-technique.md" \
  "$SCRIPT_DIR/05-deploiement/README.md" \
  "$SCRIPT_DIR/06-bilan/README.md" \
  "$SCRIPT_DIR/PLAN_RNCP_COMPLET.md" \
  "$SCRIPT_DIR/MAPPING_COMPETENCES.md" \
  "$SCRIPT_DIR/contribution-personnelle.md" \
  -o "$OUTPUT" \
  --template eisvogel \
  --pdf-engine=xelatex \
  --toc \
  --toc-depth=3 \
  --number-sections \
  --metadata-file "$SCRIPT_DIR/metadata.yml" \
  --filter mermaid-filter \
  --filter pandoc-latex-environment \
  --highlight-style tango \
  --resource-path="$SCRIPT_DIR:$SCRIPT_DIR/07-annexes" \
  -V classoption=oneside \
  2>&1

echo "✓ PDF généré : $OUTPUT"
