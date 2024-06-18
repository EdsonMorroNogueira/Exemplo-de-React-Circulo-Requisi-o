import Dropzone from "react-dropzone";
import { DropContainer, UploadMessage } from "./styles";

export default function Upload({ onUpload }) {
 const renderDragMessage = (isDragActive, isDragReject) => {
    if (!isDragActive) {
      return <UploadMessage>Arraste arquivos aqui...</UploadMessage>;
    }

    if (isDragReject) {
      return <UploadMessage type="error">Arquivo não suportado</UploadMessage>;
    }

    return <UploadMessage type="success">Solte os arquivos aqui</UploadMessage>;
  };

  return (
    <>
      <Dropzone
        accept={{"image/*": ["image/jpeg", "image/pjpeg", "image/png", "image/gif"]}}
        onDropAccepted={onUpload}
      >
        {({getRootProps, getInputProps, isDragActive, isDragReject}) => (
          <div {...getRootProps()}>
          <DropContainer
            isDragActive={isDragActive}
            isDragReject={isDragReject}
            >
              <input {...getInputProps()} />
              {renderDragMessage(isDragActive, isDragReject)}    
            </DropContainer>
            </div>
        )}
      </Dropzone>
    </>
  );
}
