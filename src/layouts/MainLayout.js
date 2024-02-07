import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";



const MainLayout = (props) => {

  return (
    <div className="my-0 mx-auto min-h-screen mobile-w">
      <Header />
      <div>{props.children}</div>
    </div>
  );
};
export default MainLayout;
