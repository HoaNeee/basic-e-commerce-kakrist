import React from "react";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ code: string }>;
}) => {
  const { code } = await params;
  return {
    title: `Error - ${code}`,
    description: `An error occurred with code ${code}`,
  };
};

const ErrorCodePage = async ({
  params,
}: {
  params: Promise<{ code: string }>;
}) => {
  const { code } = await params;

  const renderError = () => {
    switch (code) {
      case "404":
        return <div className="text-start text-sm">Page Not Found (404)</div>;
      case "500":
        return (
          <div className="text-start text-sm">Internal Server Error (500)</div>
        );
      case "429":
        return (
          <div className="text-start text-sm">Too Many Requests (429)</div>
        );
      default:
        return (
          <div className="text-start text-sm">
            An unexpected error occurred ({code})
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black p-3">
      {renderError()}
    </div>
  );
};

export default ErrorCodePage;
