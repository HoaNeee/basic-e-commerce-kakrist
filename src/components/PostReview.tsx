/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import { Rating, RatingButton } from "./ui/rating";
import { Textarea } from "./ui/textarea";
import ButtonLoading from "./ButtonLoading";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { StarIcon, Upload, X } from "lucide-react";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from "./ui/file-upload";
import { Button } from "./ui/button";

interface Props {
  onSubmit?: (data: {
    rateScore: number;
    title: string;
    content: string;
    files: File[];
  }) => void;
  isPosting?: boolean;
  isResetForm?: boolean;
  setIsResetFormReview?: (value: boolean) => void;
  smaller?: boolean;
}

const PostReview = (props: Props) => {
  const { onSubmit, isPosting, isResetForm, setIsResetFormReview, smaller } =
    props;

  const [rateScore, setRateScore] = useState<number>(0);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    if (isResetForm) {
      setRateScore(0);
      setTitle("");
      setContent("");
      setFiles([]);
      setIsResetFormReview?.(false);
    }
  }, [isResetForm]);

  return (
    <>
      <div className={` ${smaller ? "text-xs" : "text-sm"}`}>
        <Label
          className={`dark:text-gray-300 block font-medium text-gray-700 ${
            smaller ? "text-xs mb-1" : "mb-3"
          }`}
        >
          Your Rating *
        </Label>
        <div className="sm:justify-start flex items-center justify-center">
          <Rating
            onValueChange={(e) => {
              setRateScore(e);
            }}
            value={rateScore}
          >
            {Array.from({ length: 5 }).map((_, idx) => (
              <RatingButton
                key={idx}
                size={smaller ? 28 : 32}
                className={`${
                  idx < rateScore
                    ? "text-yellow-500 hover:text-yellow-600"
                    : "text-gray-300 hover:text-yellow-400"
                } transition-colors duration-200`}
                icon={
                  <StarIcon
                    strokeWidth={1}
                    fill={idx < rateScore ? "currentColor" : "none"}
                  />
                }
                index={idx}
              />
            ))}
          </Rating>
        </div>
      </div>

      <div className={`lg:grid-cols-2 grid grid-cols-1 gap-6`}>
        <div className={`${smaller ? "space-y-1" : "space-y-2"}`}>
          <Label
            htmlFor="title"
            className={`dark:text-gray-300 font-medium text-gray-700 ${
              smaller ? "text-xs" : "text-sm"
            }`}
          >
            Review Title
          </Label>
          <Input
            id="title"
            placeholder="Summarize your experience"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="dark:border-gray-600 focus:border-primary focus:ring-primary border-gray-300"
          />
        </div>
      </div>

      <div className={`${smaller ? "space-y-1" : "space-y-2"}`}>
        <Label
          htmlFor="content"
          className={`dark:text-gray-300 font-medium text-gray-700 ${
            smaller ? "text-xs" : "text-sm"
          }`}
        >
          Your Review
        </Label>
        <Textarea
          id="content"
          placeholder="Share your thoughts about this product..."
          className={`${
            smaller ? "min-h-26" : "min-h-32"
          } dark:border-gray-600 focus:border-primary focus:ring-primary border-gray-300 resize-none`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      <div className={`${smaller ? "space-y-1" : "space-y-2"}`}>
        <Label
          className={`dark:text-gray-300 font-medium text-gray-700 ${
            smaller ? "text-xs" : "text-sm"
          }`}
        >
          Add Photos (Optional)
        </Label>
        <FileUpload
          value={files}
          onValueChange={setFiles}
          accept="image/*"
          maxFiles={5}
          className="w-full"
          multiple
        >
          <FileUploadDropzone
            className={`dark:border-gray-600 hover:border-primary text-center transition-colors duration-200 border-2 border-gray-300 border-dashed rounded-lg ${
              smaller ? "p-4" : "p-8"
            }`}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="dark:border-gray-600 flex items-center justify-center w-12 h-12 border-2 border-gray-300 rounded-full">
                <Upload className="w-6 h-6 text-gray-500" />
              </div>
              <div>
                <p
                  className={`dark:text-gray-300 font-medium text-gray-700 ${
                    smaller ? "text-xs" : "text-sm"
                  }`}
                >
                  Drag & drop photos here
                </p>
                <p
                  className={`dark:text-gray-400 mt-1 text-gray-500 ${
                    smaller ? "text-xs" : "text-sm"
                  }`}
                >
                  or click to browse (max 5 images)
                </p>
              </div>
              <FileUploadTrigger asChild>
                <Button variant="outline" size="sm" className="mt-2">
                  Choose Files
                </Button>
              </FileUploadTrigger>
            </div>
          </FileUploadDropzone>

          {files.length > 0 && (
            <div className="md:max-w-md max-w-70 overflow-hidden overflow-x-auto">
              <FileUploadList orientation="horizontal" className="gap-4 mt-4">
                {files.map((file, index) => (
                  <FileUploadItem
                    key={index}
                    value={file}
                    className="group relative"
                  >
                    <div className="dark:border-gray-600 relative w-20 h-20 border-2 border-gray-200 rounded-lg">
                      <FileUploadItemPreview
                        className="w-full h-full"
                        render={() => (
                          <img
                            src={URL.createObjectURL(file)}
                            alt="Review image"
                            className="object-cover w-full h-full"
                          />
                        )}
                      />
                      <FileUploadItemDelete
                        asChild
                        className="-top-2 -right-2 md:group-hover:opacity-100 md:opacity-0 absolute z-10 transition-opacity duration-200 opacity-100"
                      >
                        <Button
                          variant="destructive"
                          size="icon"
                          className="w-6 h-6 rounded-full"
                          title="Remove image"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </FileUploadItemDelete>
                    </div>
                  </FileUploadItem>
                ))}
              </FileUploadList>
            </div>
          )}
        </FileUpload>
      </div>

      <div className="dark:border-gray-700 flex justify-end pt-4 border-t border-gray-200">
        <ButtonLoading
          loading={isPosting}
          disabled={!rateScore}
          className="px-8 py-2.5 min-w-32"
          onClick={() =>
            onSubmit?.({
              rateScore,
              title,
              content,
              files,
            })
          }
        >
          {isPosting ? "Publishing..." : "Publish Review"}
        </ButtonLoading>
      </div>
    </>
  );
};

export default PostReview;
