aws s3 rm s3://$AHC_BUCKET/ --recursive
aws s3 cp public/ s3://$AHC_BUCKET/ --recursive --acl public-read --metadata-directive REPLACE  --cache-control "max-age=31536000,public" 
aws s3 cp public/index.html s3://$AHC_BUCKET/index.html --acl public-read --metadata-directive REPLACE --content-encoding="gzip" --content-type="text/html; charset=UTF-8" --cache-control "max-age=31536000,public" 
aws s3 cp public/manifest.json s3://$AHC_BUCKET/manifest.json --acl public-read --metadata-directive REPLACE --content-encoding="gzip" --cache-control "max-age=31536000,public" 
aws cloudfront create-invalidation --distribution-id $AHC_CACHE --paths "/*"