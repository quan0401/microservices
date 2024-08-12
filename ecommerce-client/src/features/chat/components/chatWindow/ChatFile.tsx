import { AxiosError, AxiosResponse, isAxiosError } from 'axios';
import { FC, ReactElement } from 'react';
import { FaRegFileArchive, FaRegPlayCircle, FaDownload } from 'react-icons/fa';
import { IChatMessageProps } from '~features/chat/interfaces/chat.interface';
import { checkUrlExtension, IFileType } from '~shared/utils/image-utils.service';
import { bytesToSize, downloadFile, getFileBlob, showErrorToast } from '~shared/utils/utils.service';

const ChatFile: FC<IChatMessageProps> = ({ message }): ReactElement => {
  const type: IFileType = checkUrlExtension(`${message.fileType}`);
  const downloadChatFile = async (url: string, fileName: string): Promise<void> => {
    try {
      const response: AxiosResponse = await getFileBlob(url);
      const blobUrl: string = URL.createObjectURL(new Blob([response.data]));
      downloadFile(blobUrl, fileName);
    } catch (error) {
      if (isAxiosError(error)) {
        const { name, message, response } = error as AxiosError;
        console.log({
          name,
          message,
          responseStatus: response?.status,
          responseData: response?.data
        });
      } else {
        console.log(error);
      }
      showErrorToast('Error downloading file.');
    }
  };
  return (
    <div className="flex w-64 min-w-[100%] flex-col">
      <div className="z-1 mt-2 flex flex-col rounded">
        {type === 'image' && <img className="max-h-72 max-w-48 rounded object-center object-cover " src={message.file} alt="" />}
        {type === 'zip' && (
          <div className="border-grey relative flex h-[120px] w-64 items-center justify-center rounded-md border">
            <FaRegFileArchive className="absolute" size={25} />
          </div>
        )}

        {type === 'video' && (
          <div className="border-grey relative flex h-[150px] w-64 items-center justify-center rounded-md border">
            <FaRegPlayCircle className="absolute" size={25} />
            <video width="100%" src="" />
          </div>
        )}
      </div>
      <div className="flex w-auto justify-between">
        <div className="flex gap-1 truncate">
          <FaDownload size={10} className="flex self-center" onClick={() => downloadChatFile(`${message.file}`, `${message.fileName}`)} />
          <span className="truncate text-xs md:text-sm">{message.fileName}</span>
        </div>
        <span className="truncate text-xs md:text-sm">({bytesToSize(parseInt(`${message.fileSize}`))})</span>
      </div>
    </div>
  );
};

export default ChatFile;
