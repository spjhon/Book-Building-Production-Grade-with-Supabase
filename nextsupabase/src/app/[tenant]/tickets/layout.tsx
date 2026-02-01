import { Navbar } from "@/components/Navbar";

interface TicketsLayoutProps {
  children: React.ReactNode;
}

const TicketsLayout = ({ children }: TicketsLayoutProps) => {
  return (
    <>
      <section>
        <Navbar></Navbar>
      </section>

      <section>
        Layout de tickets
        {children}
      </section>
    </>
  );
};

export default TicketsLayout;
