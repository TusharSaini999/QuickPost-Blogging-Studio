import { useRef, useEffect } from "react";
import { CheckCircle, AlertCircle, X, Trash2 } from "lucide-react";

const StatusModal = ({
  show = false,
  onClose,
  type = "success",
  title,
  description,
  cancelText = "Cancel",
  confirmText = "Delete",
  onConfirm
}) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (show) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [show, onClose]);

  if (!show) return null;

  let icon;
  if (type === "success") {
    icon = <CheckCircle className="mx-auto mb-4 text-green-500 w-12 h-12" />;
  } else if (type === "delete") {
    icon = <Trash2 className="mx-auto mb-4 text-red-600 w-12 h-12" />;
  } else {
    icon = <AlertCircle className="mx-auto mb-4 text-red-500 w-12 h-12" />;
  }

  return (
    <div className="w-screen fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div
        ref={modalRef}
        className="relative p-4 w-full max-w-md bg-white rounded-lg shadow dark:bg-gray-700 text-right"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-2.5 text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <X />
        </button>

        {/* Modal Content */}
        <div className="p-4 md:p-5 text-center">
          {icon}
          <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-200">
            {title}
          </h3>
          <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
        </div>

        <div className="flex justify-end gap-3">
          {/* Cancel Button */}
          <button
            onClick={onClose}
            className="py-2.5 px-5 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-red-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700"
          >
            {cancelText}
          </button>

          {/* Confirm Delete Button (only if delete type) */}
          {type === "delete" && (
            <button
              onClick={onConfirm}
              className="py-2.5 px-5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800"
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatusModal;



//  const [showModal, setShowModal] = useState(false);
//   const [modalData, setModalData] = useState({
//     type: "success",
//     title: "",
//     description: "",
//     cancelText: "Close",
//   });

//  <StatusModal
//         show={showModal}
//         onClose={() => setShowModal(false)}
//         type={modalData.type}
//         title={modalData.title}
//         description={modalData.description}
//         cancelText={modalData.cancelText}
//       />