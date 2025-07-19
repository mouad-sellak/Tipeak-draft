export default function LoadingSkeleton() {
    return (
      <div className="animate-pulse space-y-6">
        <div className="w-24 h-24 mx-auto rounded-full bg-white/20" />
        <div className="h-6 w-40 mx-auto bg-white/20 rounded" />
        <div className="bg-white/10 rounded-2xl h-52" />
      </div>
    );
  }
  