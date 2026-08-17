import Icon from "@/components/Icon";
import { getGalleryImages } from "@/lib/queries";
import { uploadGalleryPhotoAction, deleteGalleryPhotoAction } from "../../actions";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const gallery = getGalleryImages();

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-outline-variant pb-4">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">
            Showroom &amp; Harvest Photo Gallery
          </h1>
          <p className="font-body-md text-sm text-on-surface-variant">
            Upload and manage photography from the Lethipora showroom, saffron fields, and packaging line.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 Cols: Existing Gallery Grid */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="font-headline-md text-lg font-bold text-on-surface">
            Uploaded Photos ({gallery.length})
          </h2>

          {gallery.length === 0 ? (
            <div className="bg-surface border border-outline-variant rounded-xl p-8 text-center text-on-surface-variant text-sm">
              No custom photos uploaded yet. Use the upload box to add photos to the storefront gallery.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {gallery.map((img) => (
                <div
                  key={img.id}
                  className="group relative bg-surface border border-outline-variant rounded-xl overflow-hidden shadow-sm flex flex-col"
                >
                  <div className="aspect-square bg-surface-container relative overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.url}
                      alt={img.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[9px] font-label-md uppercase font-bold px-2 py-0.5 rounded">
                      {img.category}
                    </span>
                  </div>
                  <div className="p-2.5 flex items-center justify-between bg-surface text-xs">
                    <p className="font-semibold text-on-surface line-clamp-1 flex-1 pr-2">
                      {img.title}
                    </p>
                    <form action={deleteGalleryPhotoAction}>
                      <input type="hidden" name="id" value={img.id} />
                      <button
                        type="submit"
                        className="text-outline hover:text-error transition-colors p-1"
                        aria-label={`Delete ${img.title}`}
                      >
                        <Icon name="delete" className="text-base" />
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 5 Cols: Photo Uploader Box */}
        <div className="lg:col-span-5 bg-surface border border-outline-variant rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="font-headline-md text-base font-bold text-on-surface flex items-center gap-2">
            <Icon name="cloud_upload" className="text-primary" /> Upload New Photo
          </h2>

          <form action={uploadGalleryPhotoAction} className="space-y-4">
            <div>
              <label htmlFor="photo_file" className="block font-label-md text-xs uppercase font-bold text-on-surface-variant mb-1">
                Select Photo File (JPEG, PNG, WebP) *
              </label>
              <input
                id="photo_file"
                name="photo_file"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                required
                className="w-full border border-outline-variant bg-surface-container-lowest rounded-lg p-2.5 text-xs text-on-surface file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-primary file:text-white hover:file:bg-primary-container"
              />
            </div>

            <div>
              <label htmlFor="title" className="block font-label-md text-xs uppercase font-bold text-on-surface-variant mb-1">
                Photo Caption / Title *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                placeholder="e.g. Saffron Harvest at Dawn, Lethipora"
                className="w-full border border-outline-variant bg-surface-container-lowest rounded-lg px-3.5 py-2.5 text-sm font-body-md"
              />
            </div>

            <div>
              <label htmlFor="category" className="block font-label-md text-xs uppercase font-bold text-on-surface-variant mb-1">
                Category
              </label>
              <select
                id="category"
                name="category"
                defaultValue="showroom"
                className="w-full border border-outline-variant bg-surface rounded-lg px-3 py-2 text-sm font-body-md"
              >
                <option value="showroom">Pampore Showroom &amp; Lounge</option>
                <option value="harvest">Saffron Karewa Fields &amp; Harvest</option>
                <option value="packaging">Sealed Glass Packaging &amp; Lab Jars</option>
                <option value="tea-lounge">Traditional Kahwa Tea Experience</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-container text-on-primary font-label-md text-xs font-bold uppercase py-3 rounded-lg transition-colors shadow-sm"
            >
              Upload to Gallery
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
