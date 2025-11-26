import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const Statements = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // determine the active tab from the URL
  const currentPath = location.pathname;

  let currentTab = "history";
  if (currentPath.includes("accounts-ledger")) currentTab = "accounts";
  if (currentPath.includes("audit-logs")) currentTab = "audit";

  const handleChange = (value: string) => {
    if (value === "history") navigate("/commissions/statements");
    if (value === "accounts") navigate("/commissions/statements/accounts-ledger");
    if (value === "audit") navigate("/commissions/statements/audit-logs");
  };

  return (
    <div className="mt-4">
      <Tabs value={currentTab} onValueChange={handleChange} className="w-full">

        {/* Top Tabs */}
        <TabsList className="w-fit bg-transparent rounded-none h-auto px-0 gap-6">
          <TabsTrigger
            value="history"
            className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 
                       rounded-none pb-2 text-sm"
          >
            History Ledger
          </TabsTrigger>

          <TabsTrigger
            value="accounts"
            className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 
                       rounded-none pb-2 text-sm"
          >
            Account Ledger
          </TabsTrigger>

          <TabsTrigger
            value="audit"
            className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 
                       rounded-none pb-2 text-sm"
          >
            Audit Logs
          </TabsTrigger>
        </TabsList>

        {/* Route-nested content */}
        <div className="mt-6">
          <TabsContent value="history">
            <Outlet />
          </TabsContent>

          <TabsContent value="accounts">
            <Outlet />
          </TabsContent>

          <TabsContent value="audit">
            <Outlet />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default Statements;
