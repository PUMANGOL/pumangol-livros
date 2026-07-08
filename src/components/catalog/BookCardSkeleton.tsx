import ContentLoader from 'react-content-loader';

interface BookCardSkeletonProps {
  count?: number;
}

function BookCardSkeletonItem() {
  return (
    <div className="book-card" aria-hidden="true">
      <ContentLoader
        speed={1.5}
        width="100%"
        height={240}
        viewBox="0 0 200 240"
        backgroundColor="#f1f5f9"
        foregroundColor="#e2e8f0"
        style={{ display: 'block' }}
      >
        {/* Cover area */}
        <rect x="0" y="0" rx="0" ry="0" width="200" height="140" />

        {/* Title line 1 */}
        <rect x="12" y="153" rx="4" ry="4" width="145" height="10" />
        {/* Title line 2 */}
        <rect x="12" y="168" rx="4" ry="4" width="110" height="10" />

        {/* Meta / category */}
        <rect x="12" y="186" rx="3" ry="3" width="80" height="8" />

        {/* Price */}
        <rect x="12" y="212" rx="4" ry="4" width="52" height="12" />
        {/* Cart button */}
        <rect x="154" y="208" rx="11" ry="11" width="34" height="20" />
      </ContentLoader>
    </div>
  );
}

export function BookCardSkeleton({ count = 8 }: BookCardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <BookCardSkeletonItem key={i} />
      ))}
    </>
  );
}
