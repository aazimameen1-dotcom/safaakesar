import Icon from "@/components/Icon";
import { getReviews } from "@/lib/queries";
import {
  saveReviewAction,
  deleteReviewAction,
  toggleReviewFeaturedAction,
} from "../../actions";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  const reviews = getReviews();

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-outline-variant pb-4">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">
            Customer Reviews &amp; Testimonials
          </h1>
          <p className="font-body-md text-sm text-on-surface-variant">
            Moderate verified customer feedback, Google Maps traveler reviews, and featured ratings.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 Cols: Reviews List */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="font-headline-md text-lg font-bold text-on-surface">
            Customer Feedback ({reviews.length})
          </h2>

          {reviews.length === 0 ? (
            <div className="bg-surface border border-outline-variant rounded-xl p-8 text-center text-on-surface-variant text-sm">
              No customer reviews added yet.
            </div>
          ) : (
            <div className="space-y-3">
              {reviews.map((r) => (
                <div
                  key={r.id}
                  className="bg-surface border border-outline-variant rounded-xl p-5 shadow-sm space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-1.5 text-secondary text-sm mb-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Icon
                            key={i}
                            name="star"
                            fill={i < r.rating}
                            className={`text-base ${
                              i < r.rating ? "text-secondary" : "text-outline-variant"
                            }`}
                          />
                        ))}
                        <span className="font-bold text-xs text-on-surface ml-1">
                          {r.rating}.0
                        </span>
                      </div>
                      <p className="font-bold text-sm text-on-surface">{r.author_name}</p>
                      <span className="inline-block text-[10px] font-label-md uppercase font-bold text-trust-olive bg-trust-olive/10 px-2 py-0.5 rounded mt-0.5">
                        {r.source === "google_maps" ? "Verified Google Maps Review" : "Storefront Verified"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <form action={toggleReviewFeaturedAction}>
                        <input type="hidden" name="id" value={r.id} />
                        <input
                          type="hidden"
                          name="featured"
                          value={r.featured ? "0" : "1"}
                        />
                        <button
                          type="submit"
                          className={`text-xs font-label-md font-bold uppercase px-2.5 py-1 rounded-lg border transition-colors ${
                            r.featured
                              ? "bg-secondary text-on-secondary border-secondary"
                              : "border-outline-variant text-on-surface-variant hover:border-secondary"
                          }`}
                          title="Toggle featured status"
                        >
                          {r.featured ? "★ Featured" : "Feature"}
                        </button>
                      </form>

                      <form action={deleteReviewAction}>
                        <input type="hidden" name="id" value={r.id} />
                        <button
                          type="submit"
                          className="p-1 text-outline hover:text-error transition-colors"
                          aria-label={`Delete review by ${r.author_name}`}
                        >
                          <Icon name="delete" className="text-base" />
                        </button>
                      </form>
                    </div>
                  </div>

                  <p className="font-body-md text-xs text-on-surface-variant leading-relaxed">
                    &ldquo;{r.comment}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 5 Cols: Add Review Form */}
        <div className="lg:col-span-5 bg-surface border border-outline-variant rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="font-headline-md text-base font-bold text-on-surface flex items-center gap-2">
            <Icon name="rate_review" className="text-primary" /> Add Customer Testimonial
          </h2>

          <form action={saveReviewAction} className="space-y-4">
            <div>
              <label htmlFor="author_name" className="block font-label-md text-xs uppercase font-bold text-on-surface-variant mb-1">
                Customer Name &amp; City *
              </label>
              <input
                id="author_name"
                name="author_name"
                type="text"
                required
                placeholder="e.g. Dr. Rajesh Sharma, Delhi"
                className="w-full border border-outline-variant bg-surface-container-lowest rounded-lg px-3.5 py-2.5 text-sm font-body-md"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="rating" className="block font-label-md text-xs uppercase font-bold text-on-surface-variant mb-1">
                  Star Rating (1-5) *
                </label>
                <select
                  id="rating"
                  name="rating"
                  defaultValue="5"
                  className="w-full border border-outline-variant bg-surface rounded-lg px-3 py-2 text-sm font-body-md"
                >
                  <option value="5">5 Stars (Excellent)</option>
                  <option value="4">4 Stars (Very Good)</option>
                  <option value="3">3 Stars (Average)</option>
                </select>
              </div>

              <div>
                <label htmlFor="source" className="block font-label-md text-xs uppercase font-bold text-on-surface-variant mb-1">
                  Review Source
                </label>
                <select
                  id="source"
                  name="source"
                  defaultValue="google_maps"
                  className="w-full border border-outline-variant bg-surface rounded-lg px-3 py-2 text-sm font-body-md"
                >
                  <option value="google_maps">Google Maps</option>
                  <option value="website">Direct Storefront</option>
                  <option value="whatsapp">WhatsApp Feedback</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="comment" className="block font-label-md text-xs uppercase font-bold text-on-surface-variant mb-1">
                Review Text / Quote *
              </label>
              <textarea
                id="comment"
                name="comment"
                required
                rows={4}
                placeholder="e.g. Visited during our Kashmir tour. Saffron aroma is unmatched and sealed glass packaging is beautiful."
                className="w-full border border-outline-variant bg-surface-container-lowest rounded-lg p-3 text-sm font-body-md"
              />
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer font-body-md text-sm text-on-surface">
                <input
                  type="checkbox"
                  name="featured"
                  defaultChecked
                  className="rounded border-outline-variant text-primary focus:ring-primary h-4 w-4"
                />
                <span>Feature prominently on homepage carousel</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-container text-on-primary font-label-md text-xs font-bold uppercase py-3 rounded-lg transition-colors shadow-sm"
            >
              Add Review
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
