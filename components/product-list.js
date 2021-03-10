import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import {
  Card,
  ResourceList,
  Stack,
  TextStyle,
  DropZone
} from '@shopify/polaris';
import React, { useState } from "react";

function DropZoneWithImageFileUpload() {
  const [files, setFiles] = useState([]);
  const [rejectedFiles, setRejectedFiles] = useState([]);
  const hasError = rejectedFiles.length > 0;

  const handleDrop = useCallback(
    (_droppedFiles, acceptedFiles, rejectedFiles) => {
      setFiles((files) => [...files, ...acceptedFiles]);
      setRejectedFiles(rejectedFiles);
    },
    [],
  );

  const fileUpload = !files.length && <DropZone.FileUpload />;
  const uploadedFiles = files.length > 0 && (
    <Stack vertical>
      {files.map((file, index) => (
        <Stack alignment="center" key={index}>
          <Thumbnail
            size="small"
            alt={file.name}
            source={window.URL.createObjectURL(file)}
          />
          <div>
            {file.name} <Caption>{file.size} bytes</Caption>
          </div>
        </Stack>
      ))}
    </Stack>
  );

  const errorMessage = hasError && (
    <Banner
      title="The following images couldn’t be uploaded:"
      status="critical"
    >
      <List type="bullet">
        {rejectedFiles.map((file, index) => (
          <List.Item key={index}>
            {`"${file.name}" is not supported. File type must be .gif, .jpg, .png or .svg.`}
          </List.Item>
        ))}
      </List>
    </Banner>
  );

  return (
    <Stack vertical>
      {errorMessage}
      <DropZone accept="image/*" type="image" onDrop={handleDrop}>
        {uploadedFiles}
        {fileUpload}
      </DropZone>
    </Stack>
  );
}



const GET_ALL_PRODUCTS = gql`
{
  products(first: 10) {
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
    edges {
      node {
        id
        title
        handle
        description
        images(first: 1) {
          edges {
            node {
              originalSrc
              altText
            }
          }
        }
        variants(first: 1) {
          edges {
            node {
              taxCode
              price
              id
              taxable
            }
          }
        }
      }
    }
  }
}
`;

function ProductList(props) {

  const [selectedItems, setSelectedItems] = useState([]);
  const resourceName = {
    singular: 'product',
    plural: 'products',
  };

  return (

    <Query query={GET_ALL_PRODUCTS} >
      {({ data, loading, error }) => {
        if (loading) return <div>Loading…</div>;
        if (error) return <div>{error.message}</div>;
        console.log(data);

        return (
          <Card>
            <ResourceList
              showHeader
              items={data.products.edges}
              resourceName={resourceName}
              renderItem={renderItem}
              selectedItems={selectedItems}
              onSelectionChange={setSelectedItems}
            />
          </Card>
        );
      }}
    </Query>
  );

  function renderItem(item) {
    const title = item.node.title;
    return (
      <ResourceList.Item
        id={item.id}
      >
        <Stack>
          <Stack.Item fill>
            <h3>
              <TextStyle variation="strong">{title}</TextStyle>
            </h3>
          </Stack.Item>
        </Stack>
      </ResourceList.Item>
    );
  }
}
export default ProductList;
