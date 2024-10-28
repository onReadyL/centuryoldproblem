export const Background = () => {
  return (
    <>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(22,119,255,0.2),rgba(0,0,0,0.1))]" />
      <div className="absolute top-0 left-0 right-0 h-[400px] bg-gradient-to-r from-blue-600/30 to-purple-600/30 -skew-y-6 origin-top-left backdrop-blur-3xl" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
    </>
  );
};
