import { useEffect, useState } from "react";
import GlobalStyle from "./styles/global.js";
import { Container, Content } from "./styles.js";
import Upload from "./components/upload/index.jsx";
import FileList from "./components/FileList/index.jsx";
import { uniqueId } from "lodash";
import {filesize} from "filesize";
import api from "./services/api";

function App() {
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleUpload = (files) => {
    const newUploadedFiles = files.map((file) => ({
      file,
      id: uniqueId(),
      name: file.name,
      readableSize: filesize(file.size),
      preview: URL.createObjectURL(file),
      progress: 0,
      uploaded: false,
      error: false,
      url: null,
    }));
    setUploadedFiles([...uploadedFiles, ...newUploadedFiles]);

    uploadedFiles.forEach(processUpload);
  };

  const updateFile = (id, data) => {
      setUploadedFiles((prevUploadedFiles) =>
        prevUploadedFiles.map((uploadedFile) =>
          id === uploadedFile.id ? { ...uploadedFile, ...data } : uploadedFile
        )
      );
  
  };

  const processUpload = (uploadedFile) => {
    const data = new FormData();

    data.append("file", uploadedFile.file, uploadedFile.name);

    api.post("/posts", data, {
      onUploadProgress: (e) => {
        var progress = parseInt(Math.round((e.loaded * 100) / e.total) - 200);
        updateFile(uploadedFile.id, {
          progress,
        });
      },
    }).then((response) => {
        updateFile(uploadedFile.id, {
          uploaded: true,
          url: response.data.url,
        });
      }).catch(() => {
        updateFile(uploadedFile.id, {
          error: true,
        });
      });
  };


  return (
    <Container>
      <GlobalStyle />
      <Content>
        <Upload onUpload={handleUpload} />
        {!!uploadedFiles.length && <FileList files={uploadedFiles} />}
      </Content>
    </Container>
  );
}

export default App;
