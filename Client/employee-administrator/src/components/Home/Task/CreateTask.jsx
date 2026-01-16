export default function CreateTask({ projectId, close }) {
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white w-1/2 h-4/5 rounded-lg shadow-lg p-6 relative">
          <h1>{projectId}</h1>
          <button onClick={close}>Close</button>
        </div>
      </div>
    </>
  );
}
