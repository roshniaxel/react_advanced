// import { useState } from "react";
// import { CustomModal } from "./CustomModal";
// import { DialogModal } from "./DialogModal";

// export default function App() {
//   const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
//   const [isDialogModalOpen, setIsDialogModalOpen] = useState(false);

//   return (
//     <div>
//       <button onClick={() => setIsCustomModalOpen(true)}>
//         Show Custom Modal
//       </button>
//       <br />
//       <button onClick={() => setIsDialogModalOpen(true)}>
//         Show Dialog Modal
//       </button>
//       <CustomModal
//         isOpen={isCustomModalOpen}
//         onClose={() => setIsCustomModalOpen(false)}
//       >
//         <p>
//           This is a <strong>CUSTOM</strong> modal
//         </p>
//         <button onClick={() => setIsCustomModalOpen(false)}>Close</button>
//       </CustomModal>

//       <DialogModal
//         isOpen={isDialogModalOpen}
//         onClose={() => setIsDialogModalOpen(false)}
//       >
//         <p>
//           This is a <strong>DIALOG</strong> modal
//         </p>
//         <button onClick={() => setIsDialogModalOpen(false)}>Close</button>
//       </DialogModal>
//     </div>
//   );
// }

// import { useState } from "react";
// import { DatePicker } from "./DatePicker";

// export default function App() {
//   const [value, setValue] = useState();
//   return <DatePicker value={value} onChange={setValue} />;
// }

import { useCallback, useEffect, useRef, useState } from "react";
import { parseLinkHeader } from "./parseLinkHeader";

const LIMIT = 50;

export default function App() {
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const nextPhotoUrlRef = useRef();

  async function fetchPhotos(url, { overwrite = false } = {}) {
    setIsLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 2000));
      const res = await fetch(url);
      nextPhotoUrlRef.current = parseLinkHeader(res.headers.get("Link")).next;
      const photos = await res.json();
      if (overwrite) {
        setPhotos(photos);
      } else {
        setPhotos((prevPhotos) => {
          return [...prevPhotos, ...photos];
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const imageRef = useCallback((image) => {
    if (image == null || nextPhotoUrlRef.current == null) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchPhotos(nextPhotoUrlRef.current);
        observer.unobserve(image);
      }
    });

    observer.observe(image);
  }, []);

  useEffect(() => {
    fetchPhotos(
      `http://localhost:3000/photos-short-list?_page=1&_limit=${LIMIT}`,
      {
        overwrite: true,
      }
    );
  }, []);

  return (
    <div className="grid">
      {photos.map((photo, index) => (
        <img
          src={photo.url}
          key={photo.id}
          ref={index === photos.length - 1 ? imageRef : undefined}
        />
      ))}
      {isLoading &&
        Array.from({ length: LIMIT }, (_, index) => index).map((n) => {
          return (
            <div key={n} className="skeleton">
              Loading...
            </div>
          );
        })}
    </div>
  );
}
