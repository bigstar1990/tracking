export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="container mx-auto p-4 my-4 bg-white rounded-md">
      {children}
    </div>
  );
}
