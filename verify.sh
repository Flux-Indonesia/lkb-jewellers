#!/bin/bash

echo "=== SHAPE VERIFICATION ==="
for ring in ainsley amor brooke brooklyn chantelle eliana ellie hannah jacinta josephine kyla liberty miller morgan parker polly raleigh salma sophia willow; do
  shape=$(grep -A 25 "\"slug\": \"ring-$ring\"" src/data/engagement-rings.ts | grep "\"shape\":" | head -1 | sed 's/.*"shape": "\([^"]*\)".*/\1/')
  echo "ring-$ring: $shape"
done

echo ""
echo "=== SETTING STYLE VERIFICATION ==="
for ring in analyce arielle kirsten madeline nola phoebe savannah tahlia; do
  style=$(grep -A 25 "\"slug\": \"ring-$ring\"" src/data/engagement-rings.ts | grep "\"settingStyle\":" | head -1 | sed 's/.*"settingStyle": "\([^"]*\)".*/\1/')
  echo "ring-$ring: $style"
done

echo ""
echo "=== CHECKING FOR BEZEL AND EAST_WEST ==="
bezel_count=$(grep -c "\"settingStyle\": \"bezel\"" src/data/engagement-rings.ts)
east_west_count=$(grep -c "\"settingStyle\": \"east_west\"" src/data/engagement-rings.ts)
echo "Bezel count: $bezel_count (should be 0)"
echo "East-west count: $east_west_count (should be 0)"
