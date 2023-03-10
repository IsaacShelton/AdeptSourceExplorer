
# Helper script for pulling AdeptInsightNodeJS

# Configuration
# ---------------------------------------------------------------------------
APEPT_INSIGHT_NODE_JS_ROOT=~/Projects/AdeptInsightNodeJS
# ---------------------------------------------------------------------------

cp $APEPT_INSIGHT_NODE_JS_ROOT/bin/insight_server.js src/insight/insight_server.js
cp $APEPT_INSIGHT_NODE_JS_ROOT/bin/insight_server.wasm public/insight_server.wasm
cat src/insight/insight_server_postfix.js >> src/insight/insight_server.js

cat src/insight/insight_server_prefix.js > /tmp/out
cat src/insight/insight_server.js >> /tmp/out
mv /tmp/out ./src/insight/insight_server.js
