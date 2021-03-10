const getStagedUploadUrl = async (ctx, accessToken, shop) => {
const query = JSON.stringify({
  query: `mutation
  stagedUploadsCreate(
    {
      "input": [
        {
          "resource": "COLLECTION_IMAGE",
          "filename": "h5jYgD7.jpg",
          "mimeType": "image/jpeg",
          "httpMethod": "POST",
          "fileSize": "119193"
        }
      ]
    }
  ) {
    stagedTargets {
      parameters {
        name
        value
      }
      resourceUrl
      url
    }
    userErrors {
      field
      message
    }
  }
}

`

const response = await fetch(`https://${shop}/admin/api/2021-01/graphql.json`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    "X-Shopify-Access-Token": accessToken,
  },
  body: query
})

module.exports = getStagedUploadUrl;
