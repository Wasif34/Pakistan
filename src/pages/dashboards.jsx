import React, { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  BarChart3,
  PieChart,
  RefreshCw,
  Download,
  User,
  LogOut,
  Settings,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Pie,
  AreaChart,
  Area,
} from "recharts";

// Import data
import gdpGrowthData from "../data/gdp-growth.json";
import inflationData from "../data/inflation.json";
import unemploymentData from "../data/unemployment.json";
import currentAccountData from "../data/current.json";
import exchangeData from "../data/exchange.json";
import remittanceData from "../data/remittances.json";
import interestData from "../data/interest.json";
import kseData from "../data/kse.json";
import { useNavigate } from "react-router";

function remittanceUnitCalculator(amount) {
  if (amount >= 1e9) {
    return `${(amount / 1e9).toFixed(2)} B`;
  } else if (amount >= 1e6) {
    return `${(amount / 1e6).toFixed(2)} M`;
  } else if (amount >= 1e3) {
    return `${(amount / 1e3).toFixed(2)} K`;
  }
  return amount.toString();
}
export const Dashboards = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  // Get latest data for each metric
  const latestInflation = inflationData[inflationData.length - 1];
  const latestUnemployment = unemploymentData[unemploymentData.length - 1];
  const latestCurrentAccount =
    currentAccountData[currentAccountData.length - 1];
  const latestExchange = exchangeData[exchangeData.length - 1];
  const latestRemittance = remittanceData[remittanceData.length - 1];
  const latestInterest = interestData[interestData.length - 1];
  const latestKSE = kseData[kseData.length - 1];

  // Calculate overall GDP growth (average of all sectors for latest month);

  let totalRemittance = remittanceData.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  totalRemittance = remittanceUnitCalculator(totalRemittance);

  console.log("Total Remittance:", totalRemittance);
  const latestGDPData = gdpGrowthData.filter((item) => item.month === "June");
  const avgGDPGrowth =
    latestGDPData.reduce((sum, item) => sum + item.growth_rate, 0) /
    latestGDPData.length;
  const avgGDPChange =
    latestGDPData.reduce(
      (sum, item) => sum + (item.change_vs_last_month || 0),
      0
    ) / latestGDPData.length;

  // Exchange rate (mock data since not in provided JSON)
  const exchangeRate = 287.5;
  const exchangeRateChange = -0.8;

  // Prepare chart data
  const monthOrder = [
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
  ];
  const gdpChartData = monthOrder.map((month) => {
    const monthData = gdpGrowthData.filter((item) => item.month === month);
    const avgGrowth =
      monthData.reduce((sum, item) => sum + item.growth_rate, 0) /
      monthData.length;
    return {
      month: month.substring(0, 3),
      growth: Number(avgGrowth.toFixed(1)),
    };
  });

  const inflationChartData = inflationData.map((item) => ({
    month: item.month.substring(0, 3),
    inflation: item.value,
  }));

  const tradeBalanceData = [
    { sector: "Agriculture", exports: 25, imports: 15 },
    { sector: "Manufacturing", exports: 45, imports: 55 },
    { sector: "Services", exports: 20, imports: 18 },
    { sector: "Energy", exports: 5, imports: 35 },
    { sector: "Technology", exports: 15, imports: 25 },
  ];

  const gdpBySectorData = latestGDPData.map((item) => ({
    name: item.sector,
    value: item.growth_rate,
    percentage: (((item.growth_rate / avgGDPGrowth) * 100) / 3).toFixed(1),
  }));

  const remittanceChartData = remittanceData.map((item) => ({
    month: item.month.substring(0, 3),
    remittance: item.amount,
  }));

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Profile Bar */}
      <div className="bg-white shadow-sm border-b">
        <div className="w-full py-3 px-3">
          <div className="flex justify-end items-center">
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-1 p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <div className="w-8 h-8 text-gray-600 rounded-full flex items-center justify-center font-semibold">
                  A
                </div>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border z-50">
                  <div className="p-4 border-b">
                    <div className="font-semibold text-gray-800">Admin</div>
                    <div className="text-sm text-gray-500">admin@gmail.com</div>
                  </div>
                  <div className="py-2">
                    <button className="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-gray-50 text-gray-700">
                      <User className="w-4 h-4" />
                      Profile
                    </button>
                    <button className="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-gray-50 text-gray-700">
                      <Settings className="w-4 h-4" />
                      Settings
                    </button>
                    <button
                      className="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-gray-50 text-gray-700"
                      onClick={() => {
                        localStorage.removeItem("isAuthenticated");
                        navigate("/login");
                      }}
                    >
                      <LogOut className="w-4 h-4" />
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-500 to-green-700 bg-clip-text text-transparent">
              Pakistan Economic Dashboard
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              Last updated: Monday, July 21, 2025
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm">
              <RefreshCw className="w-4 h-4" />
              Refresh Data
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-md hover:shadow-lg">
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>
        {/* KPI Cards Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="group bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  GDP Growth Rate
                </span>
              </div>
              {avgGDPChange >= 0 ? (
                <div className="p-1 bg-green-100 rounded-full">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
              ) : (
                <div className="p-1 bg-red-100 rounded-full">
                  <TrendingDown className="w-4 h-4 text-red-600" />
                </div>
              )}
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-2">
              {avgGDPGrowth.toFixed(1)}%
            </div>
            <div
              className={`text-sm font-medium ${
                avgGDPChange >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {avgGDPChange >= 0 ? "+" : ""}
              {avgGDPChange.toFixed(1)}% vs last month
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Average across all sectors
            </div>
          </div>

          <div className="group bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
                  <TrendingUp className="w-6 h-6 text-red-600" />
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  Inflation Rate
                </span>
              </div>
              {latestInflation.change >= 0 ? (
                <div className="p-1 bg-red-100 rounded-full">
                  <TrendingUp className="w-4 h-4 text-red-600" />
                </div>
              ) : (
                <div className="p-1 bg-green-100 rounded-full">
                  <TrendingDown className="w-4 h-4 text-green-600" />
                </div>
              )}
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-2">
              {latestInflation.value}%
            </div>
            <div
              className={`text-sm font-medium ${
                latestInflation.change >= 0 ? "text-red-600" : "text-green-600"
              }`}
            >
              {latestInflation.change >= 0 ? "+" : ""}
              {latestInflation.change}% vs last month
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Consumer Price Index
            </div>
          </div>

          <div className="group bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  Unemployment Rate
                </span>
              </div>
              {latestUnemployment.change >= 0 ? (
                <div className="p-1 bg-red-100 rounded-full">
                  <TrendingUp className="w-4 h-4 text-red-600" />
                </div>
              ) : (
                <div className="p-1 bg-green-100 rounded-full">
                  <TrendingDown className="w-4 h-4 text-green-600" />
                </div>
              )}
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-2">
              {latestUnemployment.value}%
            </div>
            <div
              className={`text-sm font-medium ${
                latestUnemployment.change >= 0
                  ? "text-red-600"
                  : "text-green-600"
              }`}
            >
              {latestUnemployment.change >= 0 ? "+" : ""}
              {latestUnemployment.change}% vs last month
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Labor force statistics
            </div>
          </div>
          <div className="group bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  Workers Remittance
                </span>
              </div>
              {latestRemittance.change >= 0 ? (
                <div className="p-1 bg-red-100 rounded-full">
                  <TrendingUp className="w-4 h-4 text-red-600" />
                </div>
              ) : (
                <div className="p-1 bg-green-100 rounded-full">
                  <TrendingDown className="w-4 h-4 text-green-600" />
                </div>
              )}
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-2">$32B</div>
            <div
              className={`text-sm font-medium ${
                latestRemittance.change >= 0 ? "text-red-600" : "text-green-600"
              }`}
            >
              {latestRemittance.change >= 0 ? "+" : ""}
              {latestRemittance.change}% vs last month
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Labor force statistics
            </div>
          </div>
        </div>
        {/* KPI Cards Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="group bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  Current Account
                </span>
              </div>
              {latestCurrentAccount.change >= 0 ? (
                <div className="p-1 bg-green-100 rounded-full">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
              ) : (
                <div className="p-1 bg-red-100 rounded-full">
                  <TrendingDown className="w-4 h-4 text-red-600" />
                </div>
              )}
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-2">
              {latestCurrentAccount.balance >= 0 ? "+" : ""}
              {latestCurrentAccount.balance}
              <span className="text-lg">B USD</span>
            </div>
            <div
              className={`text-sm font-medium ${
                latestCurrentAccount.change >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {latestCurrentAccount.change >= 0 ? "+" : ""}
              {latestCurrentAccount.change}B vs last month
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Balance of payments
            </div>
          </div>

          <div className="group bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  Foreign Reserves
                </span>
              </div>
              {latestExchange.change >= 0 ? (
                <div className="p-1 bg-green-100 rounded-full">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
              ) : (
                <div className="p-1 bg-red-100 rounded-full">
                  <TrendingDown className="w-4 h-4 text-red-600" />
                </div>
              )}
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-2">
              {latestExchange.totalReserves}
              <span className="text-lg">B USD</span>
            </div>
            <div
              className={`text-sm font-medium ${
                latestExchange.change >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {latestExchange.change >= 0 ? "+" : ""}
              {latestExchange.change}B vs last month
            </div>
            <div className="text-xs text-gray-500 mt-1">SBP forex reserves</div>
          </div>

          <div className="group bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  Exchange Rate
                </span>
              </div>
              {exchangeRateChange >= 0 ? (
                <div className="p-1 bg-red-100 rounded-full">
                  <TrendingUp className="w-4 h-4 text-red-600" />
                </div>
              ) : (
                <div className="p-1 bg-green-100 rounded-full">
                  <TrendingDown className="w-4 h-4 text-green-600" />
                </div>
              )}
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-2">
              {exchangeRate}
              <span className="text-lg">PKR/USD</span>
            </div>
            <div
              className={`text-sm font-medium ${
                exchangeRateChange >= 0 ? "text-red-600" : "text-green-600"
              }`}
            >
              {exchangeRateChange >= 0 ? "+" : ""}
              {exchangeRateChange}% vs last month
            </div>
            <div className="text-xs text-gray-500 mt-1">USD-PKR exchange</div>
          </div>
          <div className="group bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  Interest Rate
                </span>
              </div>
              {latestInterest.change >= 0 ? (
                <div className="p-1 bg-red-100 rounded-full">
                  <TrendingUp className="w-4 h-4 text-red-600" />
                </div>
              ) : (
                <div className="p-1 bg-green-100 rounded-full">
                  <TrendingDown className="w-4 h-4 text-green-600" />
                </div>
              )}
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-2">
              {latestInterest.rate}%
            </div>
            <div
              className={`text-sm font-medium ${
                latestInterest.change >= 0 ? "text-red-600" : "text-green-600"
              }`}
            >
              {latestInterest.change >= 0 ? "+" : ""}
              {latestInterest.change}% vs last month
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Labor force statistics
            </div>
          </div>
        </div>
        {/* Charts and Notifications Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* KPI Charts Section */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  Key Performance Indicators
                </h3>
                <p className="text-sm text-gray-600">
                  Monthly trends and performance metrics
                </p>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-xs bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors">
                  Monthly
                </button>
                <button className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors">
                  Quarterly
                </button>
              </div>
            </div>

            {/* Chart Placeholder */}
            <KseIndexAreaChart kseIndexData={kseData} />
          </div>

          {/* Notifications Module */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  Economic Alerts
                </h3>
                <p className="text-sm text-gray-600">
                  Latest updates and notifications
                </p>
              </div>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View All
              </button>
            </div>

            <div className="space-y-4 max-h-80 overflow-y-auto">
              {/* Critical Alert */}
              <div className="flex items-start gap-3 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-red-800 text-sm">
                      Critical Alert
                    </h4>
                    <span className="text-xs text-red-600">2 hours ago</span>
                  </div>
                  <p className="text-sm text-red-700">
                    Foreign reserves dropped below critical threshold of 10B USD
                  </p>
                </div>
              </div>

              {/* Warning Alert */}
              <div className="flex items-start gap-3 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-yellow-800 text-sm">
                      Market Update
                    </h4>
                    <span className="text-xs text-yellow-600">5 hours ago</span>
                  </div>
                  <p className="text-sm text-yellow-700">
                    Inflation rate showing upward trend - monitor closely
                  </p>
                </div>
              </div>

              {/* Success Alert */}
              <div className="flex items-start gap-3 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-green-800 text-sm">
                      Positive News
                    </h4>
                    <span className="text-xs text-green-600">1 day ago</span>
                  </div>
                  <p className="text-sm text-green-700">
                    GDP growth exceeded expectations for Q2 2025
                  </p>
                </div>
              </div>

              {/* Info Alert */}
              <div className="flex items-start gap-3 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-blue-800 text-sm">
                      Data Update
                    </h4>
                    <span className="text-xs text-blue-600">2 days ago</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    New unemployment statistics released by Statistics Bureau
                  </p>
                </div>
              </div>

              {/* Regular Notification */}
              <div className="flex items-start gap-3 p-4 bg-gray-50 border-l-4 border-gray-300 rounded-lg">
                <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-gray-700 text-sm">
                      System Update
                    </h4>
                    <span className="text-xs text-gray-500">3 days ago</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Dashboard performance improvements deployed successfully
                  </p>
                </div>
              </div>

              {/* Economic Policy Alert */}
              <div className="flex items-start gap-3 p-4 bg-purple-50 border-l-4 border-purple-500 rounded-lg">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-purple-800 text-sm">
                      Policy Change
                    </h4>
                    <span className="text-xs text-purple-600">1 week ago</span>
                  </div>
                  <p className="text-sm text-purple-700">
                    State Bank announced new monetary policy framework
                  </p>
                </div>
              </div>

              {/* Trade Alert */}
              <div className="flex items-start gap-3 p-4 bg-orange-50 border-l-4 border-orange-500 rounded-lg">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-orange-800 text-sm">
                      Trade Update
                    </h4>
                    <span className="text-xs text-orange-600">1 week ago</span>
                  </div>
                  <p className="text-sm text-orange-700">
                    Export figures show 15% increase compared to last quarter
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-6 pt-4 border-t border-gray-100">
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                Mark All Read
              </button>
              <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                Settings
              </button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* GDP Growth Chart */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              GDP Growth Rate
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Pakistan's GDP growth over the year (%)
            </p>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={gdpChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#f8f9fa",
                    border: "1px solid #dee2e6",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="growth"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: "#3b82f6", strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7, fill: "#1d4ed8" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Inflation Chart */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Inflation Rate Trend
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Monthly inflation rate in 2024 (%)
            </p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={inflationChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#f8f9fa",
                    border: "1px solid #dee2e6",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="inflation" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Bottom Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Trade Balance Chart */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Trade Balance by Sector
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Exports vs Imports (Billion USD)
            </p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={tradeBalanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="sector" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#f8f9fa",
                    border: "1px solid #dee2e6",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="exports"
                  fill="#10b981"
                  name="Exports"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="imports"
                  fill="#ef4444"
                  name="Imports"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* GDP by Sector Chart */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              GDP Growth by Sector
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Growth rate by sector (%)
            </p>
            <ResponsiveContainer width="100%" height={280}>
              <RechartsPieChart>
                <Pie
                  data={gdpBySectorData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {gdpBySectorData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#f8f9fa",
                    border: "1px solid #dee2e6",
                    borderRadius: "8px",
                  }}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

function KseIndexAreaChart({ kseIndexData }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md w-full">
      <h2 className="text-lg font-semibold mb-4">
        KSE-100 Index Trend (FY 2024–25)
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={kseIndexData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorIndex" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="month" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="index"
            stroke="#10b981"
            fillOpacity={1}
            fill="url(#colorIndex)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
