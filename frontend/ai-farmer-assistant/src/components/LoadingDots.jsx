const LoadingDots = ({ text = 'AI is thinking' }) => {
  return (
    <div className="flex items-center gap-2 text-surface-500">
      <span className="text-sm">{text}</span>
      <div className="flex gap-1">
        <div className="w-2 h-2 rounded-full bg-primary-400 loading-dot" />
        <div className="w-2 h-2 rounded-full bg-primary-500 loading-dot" />
        <div className="w-2 h-2 rounded-full bg-primary-600 loading-dot" />
      </div>
    </div>
  );
};

export default LoadingDots;
