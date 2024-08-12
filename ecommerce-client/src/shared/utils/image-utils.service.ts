type ICheckFileType = 'image' | 'video';

export const validateImage = (file: File, type: ICheckFileType): boolean => {
  if (type === 'image') {
    const validateImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    return file && validateImageTypes.indexOf(file.type) > -1;
  } else {
    const validVideoTypes = ['video/m4v', 'video/avi', 'video/mpg', 'video/mp4', 'video/webm'];
    return file && validVideoTypes.indexOf(type) > -1;
  }
};

export const checkImageSize = (file: File, type: ICheckFileType): string => {
  let fileError = '';
  const isValid: boolean = validateImage(file, type);
  if (!isValid) {
    fileError = `File ${file.name} not accepted`;
  }
  if (file.size > 5e7) {
    fileError = 'File is too large. Must be smaller than 50MB';
  }
  return fileError;
};

export const checkImageOrVideo = (file: File, type: ICheckFileType): boolean => {
  let isValid = true;
  if (!validateImage(file, type)) {
    window.alert(`File ${file.name} not accepted`);
    isValid = false;
    return false;
  }
  if (checkImageSize(file, type)) {
    window.alert(checkImageSize(file, type));
    isValid = false;
    return false;
  }
  return isValid;
};

export const readAsBase64 = async (file: File): Promise<string | ArrayBuffer | null> => {
  const reader: FileReader = new FileReader();
  const fileValue: Promise<string | ArrayBuffer | null> = new Promise((resolve, reject) => {
    reader.addEventListener('load', () => {
      resolve(reader.result);
    });

    reader.addEventListener('error', (event: ProgressEvent<FileReader>) => {
      reject(event);
    });
    reader.readAsDataURL(file);
  });
  return fileValue;
};

export const checkFile = (file: File): boolean => {
  let hasError = false;
  if (file.size > 1000000000) {
    // 1 GB
    window.alert('File is too large. Max. size is 1 GB.');
    hasError = true;
  }
  if (!file.name.match(/\.(jpg|jpeg|png|gif|pdf|webp|zip|m4v|avi|mpg|mp4|webm)$/)) {
    window.alert('Only files of type jpg, jpeg, png, gif or pdf are allowed');
    hasError = true;
  }
  return hasError;
};

export const fileType = (file: File): string => {
  const list: string[] = file.name.split('.');
  const fileType: string = list[list.length - 1];
  return fileType;
};

export type IFileType = 'image' | 'pdf' | 'video' | 'zip' | '';
export const checkUrlExtension = (fileExtension: string): IFileType => {
  let fileType: IFileType = '';
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension)) {
    fileType = 'image';
  }

  if (['pdf'].includes(fileExtension)) {
    fileType = 'pdf';
  }

  if (['m4v', 'avi', 'mpg', 'mp4', 'webm'].includes(fileExtension)) {
    fileType = 'video';
  }

  if (['zip'].includes(fileExtension)) {
    fileType = 'zip';
  }
  return fileType;
};
