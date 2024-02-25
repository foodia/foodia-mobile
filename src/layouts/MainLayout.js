import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";

const MainLayout = (props) => {
  return <main className="my-0 mx-auto mobile-w">{props.children}</main>;
};
export default MainLayout;
