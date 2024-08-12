import { ChangeEvent, FC, ReactElement, useRef, useState } from 'react';
import { FaCamera } from 'react-icons/fa';
import ReactQuill, { UnprivilegedEditor } from 'react-quill';
import Quill from 'quill';
import { useAppDispatch, useAppSelector } from '~/store/store';
import { IReduxState } from '~/store/store.interface';
import { GIG_MAX_LENGTH, IAllowedGigItem, ICreateGig, ISellerGig, IShowGigModal } from '~features/gigs/interfaces/gig.interface';
import Breadcrumb from '~shared/breadcrumb/Breadcrumb';
import Button from '~shared/button/Button';
import Dropdown from '~shared/dropdown/Dropdown';
import TextAreaInput from '~shared/inputs/TextAreaInput';
import TextInput from '~shared/inputs/TextInput';
import {
  categories,
  expectedGigDelivery,
  lowerCase,
  reactQuillUtils,
  replaceSpacesWithDash,
  showErrorToast,
  showSuccessToast
} from '~shared/utils/utils.service';
import TagsInput from './components/TagsInput';
import { checkImageOrVideo, readAsBase64 } from '~shared/utils/image-utils.service';
import { useGigScheme } from '~features/gigs/hooks/useGigScheme';
import { gigInfoScheme } from '~features/gigs/schemes/gig.scheme';
import { IApprovalModalContent } from '~shared/modals/interfaces/modal.interface';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import ApprovalModal from '~shared/modals/ApprovalModal';
import { useUpdateGigMutation } from '~features/gigs/services/gigs.service';
import CircularPageLoader from '~shared/page-loader/CircularPageLoader';
import { IResponse } from '~shared/shared.interface';

const EditGig: FC = (): ReactElement => {
  const authUser = useAppSelector((state: IReduxState) => state.authUser);
  const { state }: { state: ISellerGig } = useLocation();
  const defaultGigInfo: ICreateGig = {
    title: state?.title,
    categories: state?.categories,
    description: state?.description,
    subCategories: state?.subCategories,
    tags: state?.tags,
    price: state?.price,
    coverImage: state?.coverImage,
    expectedDelivery: state?.expectedDelivery,
    basicTitle: state?.basicTitle,
    basicDescription: state?.basicDescription
  };

  const seller = useAppSelector((state: IReduxState) => state.seller);
  const [gigInfo, setGigInfo] = useState<ICreateGig>(defaultGigInfo);
  const gigInfoRef = useRef<ICreateGig>(defaultGigInfo);
  const [subCategory, setSubCategory] = useState<string[]>(state?.subCategories);
  const [subCategoryInput, setSubCategoryInput] = useState<string>('');
  const [tags, setTags] = useState<string[]>(state.tags);
  const [tagsInput, setTagsInput] = useState<string>('');
  const [showGigModal, setShowGigModal] = useState<IShowGigModal>({
    image: false,
    cancel: false
  });
  const reactQuillRef = useRef<ReactQuill | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const [updateGig, { isLoading }] = useUpdateGigMutation();

  const [allowedGigItemLength, setAllowGigItemLength] = useState<IAllowedGigItem>({
    gigTitle: `${GIG_MAX_LENGTH.gigTitle - state?.title.length}/80`,
    basicTitle: `${GIG_MAX_LENGTH.basicTitle - state?.basicTitle.length}/40`,
    basicDescription: `${GIG_MAX_LENGTH.basicDescription - state?.basicDescription.length}/100`,
    descriptionCharacters: `${GIG_MAX_LENGTH.fullDescription - state?.description.length}/1200`
  });

  const [approvalModalContent, setApprovalModalContent] = useState<IApprovalModalContent>();
  const navigate = useNavigate();

  const [schemeValidation, gigInfoErrors] = useGigScheme({ scheme: gigInfoScheme, gigInfo });
  const { gigId } = useParams();

  const handleFileChange = async (e: ChangeEvent): Promise<void> => {
    const target: HTMLInputElement = e.target as HTMLInputElement;
    if (target.files?.length) {
      const file: File = target.files[0];
      const isValid = checkImageOrVideo(file, 'image');
      if (isValid) {
        const dataImage: string | ArrayBuffer | null = await readAsBase64(file);
        setGigInfo({ ...gigInfo, coverImage: `${dataImage}` });
      }
      setShowGigModal({ ...showGigModal, image: false });
    }
  };

  const handleInputChange = (e: ChangeEvent, field: string, maxLength: number) => {
    const value = (e.target as HTMLInputElement).value;
    setGigInfo({ ...gigInfo, [field]: value });
    const counter = maxLength - value.length;
    field = field === 'title' ? 'gigTitle' : field;
    setAllowGigItemLength({ ...allowedGigItemLength, [field]: `${counter}/${maxLength}` });
  };

  const onEditGig = async (): Promise<void> => {
    try {
      const editor: Quill | undefined = reactQuillRef.current?.editor;
      // the reason for this instead of using useState, since we dont want to cause re-render
      gigInfo.description = editor?.getText().trim() as string;
      const isValid: boolean = await schemeValidation();

      if (isValid) {
        const gig: ICreateGig = {
          title: gigInfo.title,
          categories: gigInfo.categories,
          description: gigInfo.description,
          subCategories: gigInfo.subCategories,
          tags,
          price: gigInfo.price,
          coverImage: gigInfo.coverImage,
          expectedDelivery: gigInfo.expectedDelivery,
          basicTitle: gigInfo.basicTitle,
          basicDescription: gigInfo.basicDescription
        };
        const response: IResponse = await updateGig({ gigId: `${gigId}`, gig }).unwrap();
        const title: string = replaceSpacesWithDash(gig.title);
        showSuccessToast('Updated gig successfull');
        navigate(`/gig/${lowerCase(`${authUser.username}/${title}/${response.gig?.sellerId}/${response.gig?.id}/view`)}`);
      }
    } catch (error) {
      showErrorToast('Error updating gig.');
    }
  };

  const onCancelEdit = (): void => {
    navigate(`/seller_profile/${lowerCase(`${authUser.username}/${state.sellerId}/edit`)}`);
  };

  return (
    <>
      {showGigModal.cancel && (
        <ApprovalModal
          approvalModalContent={approvalModalContent}
          onClose={() => setShowGigModal({ ...showGigModal, cancel: false })}
          onClick={onCancelEdit}
        />
      )}
      <div className="relative w-screen">
        <Breadcrumb breadCrumbItems={['Seller', 'Edit gig']} />
        <div className="container relative mx-auto my-5 px-2 pb-12 md:px-0">
          {isLoading && <CircularPageLoader />}
          <div className="border-grey left-0 top-0 z-10 mt-4 block rounded border bg-white p-6">
            <div className="mb-6 grid md:grid-cols-5">
              <div className="pb-2 text-base font-medium">
                Gig title<sup className="top-[-0.3em] text-base text-red-500">*</sup>
              </div>
              <div className="col-span-4 md:w-11/12 lg:w-8/12">
                <TextInput
                  className="border-grey mb-1 w-full rounded border p-2.5 text-sm font-normal text-gray-600 focus:outline-none"
                  type="text"
                  name="gigTitle"
                  value={gigInfo.title}
                  placeholder="I will build something I'm good at."
                  maxLength={80}
                  onChange={(e: ChangeEvent) => handleInputChange(e, 'title', 80)}
                />
                <span className="flex justify-end text-xs text-[#95979d]">{allowedGigItemLength.gigTitle}</span>
              </div>
            </div>
            <div className="mb-6 grid md:grid-cols-5">
              <div className="pb-2 text-base font-medium">
                Basic title<sup className="top-[-0.3em] text-base text-red-500">*</sup>
              </div>
              <div className="col-span-4 md:w-11/12 lg:w-8/12">
                <TextInput
                  className="border-grey mb-1 w-full rounded border p-2.5 text-sm font-normal text-gray-600 focus:outline-none"
                  placeholder="Write what exactly you'll do in short."
                  type="text"
                  name="basicTitle"
                  value={gigInfo.basicTitle}
                  maxLength={40}
                  onChange={(e: ChangeEvent) => handleInputChange(e, 'basicTitle', 40)}
                />
                <span className="flex justify-end text-xs text-[#95979d]">{allowedGigItemLength.basicTitle}</span>
              </div>
            </div>
            <div className="mb-6 grid md:grid-cols-5">
              <div className="pb-2 text-base font-medium">
                Brief description<sup className="top-[-0.3em] text-base text-red-500">*</sup>
              </div>
              <div className="col-span-4 md:w-11/12 lg:w-8/12">
                <TextAreaInput
                  className="border-grey mb-1 w-full rounded border p-2.5 text-sm font-normal text-gray-600 focus:outline-none"
                  placeholder="Write a brief description..."
                  name="basicDescription"
                  value={gigInfo.basicDescription}
                  rows={5}
                  maxLength={100}
                  onChange={(e: ChangeEvent) => {
                    const value = (e.target as HTMLTextAreaElement).value;
                    setGigInfo({ ...gigInfo, basicDescription: value });
                    const counter = 100 - value.length;
                    setAllowGigItemLength({ ...allowedGigItemLength, basicDescription: `${counter}/100` });
                  }}
                />
                <span className="flex justify-end text-xs text-[#95979d]">{allowedGigItemLength.basicDescription}</span>
              </div>
            </div>
            <div className="mb-6 grid md:grid-cols-5">
              <div className="pb-2 text-base font-medium">
                Full description<sup className="top-[-0.3em] text-base text-red-500">*</sup>
              </div>
              <div className="col-span-4 md:w-11/12 lg:w-8/12">
                <ReactQuill
                  theme="snow"
                  value={gigInfo.description}
                  className="border-grey rounded"
                  modules={reactQuillUtils().modules}
                  formats={reactQuillUtils().formats}
                  ref={(element: ReactQuill | null) => {
                    reactQuillRef.current = element;
                    const reactQuilEditor = reactQuillRef.current?.getEditor();
                    reactQuilEditor?.on('text-change', () => {
                      if (reactQuilEditor.getLength() > GIG_MAX_LENGTH.fullDescription) {
                        reactQuilEditor.deleteText(GIG_MAX_LENGTH.fullDescription, reactQuilEditor.getLength());
                      }
                    });
                  }}
                  onChange={(value: string, _, __, editor: UnprivilegedEditor) => {
                    setGigInfo({ ...gigInfo, description: value });
                    const counter: number = GIG_MAX_LENGTH.fullDescription - editor.getText().length;
                    setAllowGigItemLength({ ...allowedGigItemLength, descriptionCharacters: `${counter}/1200` });
                  }}
                />
                <span className="flex justify-end text-xs text-[#95979d]">{allowedGigItemLength.descriptionCharacters} Characters</span>
              </div>
            </div>
            <div className="mb-12 grid md:grid-cols-5">
              <div className="pb-2 text-base font-medium">
                Category<sup className="top-[-0.3em] text-base text-red-500">*</sup>
              </div>
              <div className="relative col-span-4 md:w-11/12 lg:w-8/12">
                <Dropdown
                  text={gigInfo.categories}
                  maxHeight="300"
                  mainClassNames="absolute bg-white"
                  showSearchInput
                  values={categories()}
                  onClick={(item: string) => {
                    setGigInfo({ ...gigInfo, categories: item });
                  }}
                />
              </div>
            </div>

            <TagsInput
              title="SubCategory"
              placeholder="E.g Website development, Mobile apps"
              gigInfo={gigInfo}
              setGigInfo={setGigInfo}
              tags={subCategory}
              itemInput={subCategoryInput}
              itemName="subCategories"
              counterText="Subcategories"
              setItem={setSubCategory}
              inputErrorMessage={false}
              setItemInput={setSubCategoryInput}
            />

            <TagsInput
              title="Tags"
              placeholder="Enter search terms for your gig"
              gigInfo={gigInfo}
              setGigInfo={setGigInfo}
              tags={tags}
              itemInput={tagsInput}
              itemName="tags"
              counterText="Tags"
              setItem={setTags}
              inputErrorMessage={false}
              setItemInput={setTagsInput}
            />

            <div className="mb-6 grid md:grid-cols-5">
              <div className="pb-2 text-base font-medium">
                Price<sup className="top-[-0.3em] text-base text-red-500">*</sup>
              </div>
              <div className="col-span-4 md:w-11/12 lg:w-8/12">
                <TextInput
                  type="number"
                  className="border-grey mb-1 w-full rounded border p-3.5 text-sm font-normal text-gray-600 focus:outline-none"
                  placeholder="Enter minimum price"
                  name="price"
                  value={gigInfo.price.toString()}
                  onChange={(e: ChangeEvent) => handleInputChange(e, 'price', 10)}
                />
              </div>
            </div>
            <div className="mb-12 grid md:grid-cols-5">
              <div className="pb-2 text-base font-medium">
                Expected delivery<sup className="top-[-0.3em] text-base text-red-500">*</sup>
              </div>
              <div className="relative col-span-4 md:w-11/12 lg:w-8/12">
                <Dropdown
                  text={gigInfo.expectedDelivery}
                  maxHeight="300"
                  mainClassNames="absolute bg-white z-40"
                  values={expectedGigDelivery()}
                  onClick={(item: string) => {
                    setGigInfo({ ...gigInfo, expectedDelivery: item });
                  }}
                />
              </div>
            </div>
            <div className="mb-6 grid md:grid-cols-5">
              <div className="mt-6 pb-2 text-base font-medium lg:mt-0">
                Cover image<sup className="top-[-0.3em] text-base text-red-500">*</sup>
              </div>
              <div
                className="relative col-span-4 cursor-pointer md:w-11/12 lg:w-8/12"
                onMouseEnter={() => {
                  setShowGigModal((item) => ({ ...item, image: !item.image }));
                }}
                onMouseLeave={() => {
                  setShowGigModal((item) => ({ ...item, image: false }));
                }}
              >
                {gigInfo.coverImage && (
                  <img src={gigInfo.coverImage} alt="Cover Image" className="left-0 top-0 h-[220px] w-[320px] bg-white object-cover" />
                )}

                {!gigInfo.coverImage && (
                  <div className="left-0 top-0 flex h-[220px] w-[320px] cursor-pointer justify-center bg-[#dee1e7]"></div>
                )}
                {showGigModal.image && (
                  <div
                    onClick={() => fileRef?.current?.click()}
                    className="absolute left-0 top-0 flex h-[220px] w-[320px] cursor-pointer justify-center bg-[#dee1e7]"
                  >
                    <FaCamera className="flex self-center" />
                  </div>
                )}
                <TextInput
                  ref={fileRef}
                  style={{ display: 'none' }}
                  name="coverImage"
                  type="file"
                  onClick={() => {
                    if (fileRef.current) {
                      fileRef.current.value = '';
                    }
                  }}
                  onChange={handleFileChange}
                />
              </div>
            </div>
            <div className="grid xs:grid-cols-1 md:grid-cols-5">
              <div className="pb-2 text-base font-medium lg:mt-0"></div>
              <div className="col-span-4 flex gap-x-4 md:w-11/12 lg:w-8/12">
                <Button
                  disabled={isLoading}
                  className="rounded bg-sky-500 px-8 py-3 text-center text-sm font-bold text-white hover:bg-sky-400 focus:outline-none md:py-3 md:text-base"
                  label="Update Gig"
                  onClick={onEditGig}
                />
                <Button
                  disabled={isLoading}
                  className="rounded bg-red-500 px-8 py-3 text-center text-sm font-bold text-white hover:bg-red-400 focus:outline-none md:py-3 md:text-base"
                  label="Cancel"
                  onClick={onCancelEdit}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditGig;
