// import { EmptyState, Layout, Page, DropZone } from '@shopify/polaris';
// import { ResourcePicker, TitleBar } from '@shopify/app-bridge-react';
import store from 'store-js';
// import ResourceListWithProducts from '../components/ResourceList';

// const img = 'https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg';
//
// class Index extends React.Component {
//   state = { open: false };
//   render() {
//     const emptyState = !store.get('ids');
//     return (
//       <Page>
//         <TitleBar
//           title="Sample App"
//           primaryAction={{
//           content: 'Select products',
//           onAction: () => this.setState({ open: true }),
//         }} />
//         <ResourcePicker
//           resourceType="Product"
//           showVariants={false}
//           open={this.state.open}
//           onSelection={(resources) => this.handleSelection(resources)}
//           onCancel={() => this.setState({ open: false })}
//         />
//         {emptyState ? (
//           <Layout>
//             <EmptyState
//               heading="Discount your products temporarily"
//               action={{
//                 content: 'Select products',
//                 onAction: () => this.setState({ open: true }),
//               }}
//               image={img}
//             >
//               <p>Select products to change their price temporarily.</p>
//             </EmptyState>
//           </Layout>
//         ) : (
//             <ResourceListWithProducts />
//           )}
//       </Page>
//     );
//   }
//
//   handleSelection = (resources) => {
//     const idsFromResources = resources.selection.map((product) => product.id);
//     this.setState({ open: false });
//     store.set('ids', idsFromResources);
//   };
// }
//
// export default Index;

const fetch = require('node-fetch');
import React, {useCallback, useState} from 'react';
import {Stack, Banner, Caption, DropZone, List, Thumbnail} from '@shopify/polaris';
// const getStagedUploadUrl = require('./server/getStagedUploadUrl');

export default function DropZoneWithImageFileUpload() {
  const [files, setFiles] = useState([]);
  const [acceptedFiles, setAcceptedFiles] = useState([]);
  const [rejectedFiles, setRejectedFiles] = useState([]);
  const hasError = rejectedFiles.length > 0;

  const handleDrop = useCallback(
    (_droppedFiles, acceptedFiles, rejectedFiles) => {
      setFiles((files) => [...files, ...acceptedFiles]);
      console.log(acceptedFiles);
      console.log(URL.createObjectURL(acceptedFiles[0]));
      setRejectedFiles(rejectedFiles);
      setAcceptedFiles(acceptedFiles);

      fetch('/upload')
      // .then(res => res.text())
      .then(text => console.log(text))



      // upload the thing

    });


const fileUpload = !files.length && <DropZone.FileUpload />;
const uploadedFiles = files.length > 0 && (
  <Stack vertical>
  {files.map((file, index) => (
    <Stack alignment="center" key={index}>
    <Thumbnail
    size="large"
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
