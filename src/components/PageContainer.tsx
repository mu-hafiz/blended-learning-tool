const PageContainer = ({ title, children }: { title?: string, children: React.ReactNode }) => (
  <div className="flex flex-col min-h-[calc(100dvh-100px)]">
    {title && <h1 className="text-left mb-2">{title}</h1>}
    {children}
  </div>
);

export default PageContainer;