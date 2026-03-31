const PageContainer = ({ title, children }: { title?: string, children: React.ReactNode }) => (
  <div className="flex flex-col min-h-[calc(100vh-100px)] pb-6">
    {title && <h1 className="text-left mb-2">{title}</h1>}
    {children}
  </div>
);

export default PageContainer;