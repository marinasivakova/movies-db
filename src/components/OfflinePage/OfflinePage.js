import ErrorHandler from "../ErrorHandler";

function OfflinePage() {
  return (
    <div>
      <ErrorHandler
        e={{
          code: "It seems you are currently experiencing network issues and is thus unable to connect to the Movies-DB app. Please try again later!",
          message:
            "Network Error",
        }}
      />
    </div>
  );
}
export default OfflinePage;
