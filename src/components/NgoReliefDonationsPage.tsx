import React, { useState, useEffect } from "react";
import QRCode from "qrcode";
import { UserProfile, DonationReceipt } from "../types";
import { VERIFIED_RELIEF_FUNDS_AND_NGOS, VerifiedDisasterNGO } from "../data/floodData";
import {
  HeartHandshake,
  QrCode,
  Copy,
  Check,
  Building2,
  CheckCircle2,
  ShieldCheck,
  FileText,
  Sparkles,
  ExternalLink,
  PieChart,
  DollarSign,
  ArrowLeft
} from "lucide-react";

interface NgoReliefDonationsPageProps {
  user: UserProfile;
  onBackToLocation: () => void;
}

export const NgoReliefDonationsPage: React.FC<NgoReliefDonationsPageProps> = ({
  user,
  onBackToLocation
}) => {
  // Ensure the page always opens from the very top
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  }, []);

  const [selectedNgoId, setSelectedNgoId] = useState<string>("goonj-rahat");
  const [selectedAmount, setSelectedAmount] = useState<number>(1200);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [donorName, setDonorName] = useState<string>(user.name || "Sohini Pallapothu");
  const [donorPan, setDonorPan] = useState<string>("");
  const [donorEmail, setDonorEmail] = useState<string>(user.email || "sohinipallapothu@gmail.com");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [copiedUpi, setCopiedUpi] = useState<boolean>(false);
  const [receipt, setReceipt] = useState<DonationReceipt | null>(null);

  const activeNgo: VerifiedDisasterNGO =
    VERIFIED_RELIEF_FUNDS_AND_NGOS.find((n) => n.id === selectedNgoId) ||
    VERIFIED_RELIEF_FUNDS_AND_NGOS[0];

  const effectiveAmount = customAmount ? Number(customAmount) || 0 : selectedAmount;

  // Generate live UPI QR Code
  useEffect(() => {
    const upiString = `upi://pay?pa=${activeNgo.upiId}&pn=${encodeURIComponent(
      activeNgo.name
    )}&am=${effectiveAmount}&cu=INR&tn=FloodReliefDonation`;

    QRCode.toDataURL(upiString, {
      width: 220,
      margin: 2,
      color: {
        dark: "#0f3e3d",
        light: "#FFFFFF"
      }
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error("QR Code Error:", err));
  }, [effectiveAmount, activeNgo.upiId, activeNgo.name]);

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(activeNgo.upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleSimulateDonation = (e: React.FormEvent) => {
    e.preventDefault();
    if (effectiveAmount <= 0) return;

    const newReceipt: DonationReceipt = {
      transactionId: `TXN-RELIEF-${Date.now().toString().slice(-8)}`,
      donorName: donorName.trim() || "Kind Citizen Donor",
      amount: effectiveAmount,
      currency: "INR (₹)",
      date: new Date().toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }),
      cause: activeNgo.name,
      taxExemptId: activeNgo.taxExemption.split("(")[0].trim()
    };

    setReceipt(newReceipt);
  };

  return (
    <div className="max-w-4xl mx-auto py-4 px-2 sm:px-4 space-y-6">
      {/* Top Breadcrumb & Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToLocation}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-semibold transition-all border border-teal-200/80 cursor-pointer shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Check Severity</span>
        </button>

        <span className="text-xs font-semibold text-teal-800 bg-teal-50 px-3 py-1 rounded-lg border border-teal-200/80">
          100% Tax Exempt &bull; 80G Certified
        </span>
      </div>

      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-teal-50/80 border border-teal-200/80 text-teal-800 text-xs font-semibold mb-2 shadow-2xs">
          <HeartHandshake className="w-4 h-4 text-teal-600" />
          <span>Transparent Indian Flood Relief & NGO Funds</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-teal-950 tracking-tight font-['Outfit',sans-serif]">
          Support Verified Flood Relief
        </h1>
        <p className="text-xs sm:text-sm text-teal-800/80 max-w-lg mx-auto mt-1 leading-relaxed">
          Choose a registered disaster NGO or Government Relief Fund, review transparent fund allocation, and make an instant UPI contribution.
        </p>
      </div>

      {/* Select NGO / Fund Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {VERIFIED_RELIEF_FUNDS_AND_NGOS.map((ngo) => {
          const isSelected = selectedNgoId === ngo.id;
          return (
            <button
              key={ngo.id}
              type="button"
              onClick={() => {
                setSelectedNgoId(ngo.id);
                setSelectedAmount(ngo.suggestedAmounts[1] || 1000);
                setCustomAmount("");
                setReceipt(null);
              }}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between shadow-2xs ${
                isSelected
                  ? "bg-teal-50/90 border-teal-800 ring-2 ring-teal-800/20"
                  : "bg-white border-teal-900/10 hover:border-teal-400"
              }`}
            >
              <div>
                <span
                  className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-md inline-block mb-1.5 ${
                    ngo.category === "Government Fund"
                      ? "bg-amber-50 text-amber-800 border border-amber-200/80"
                      : "bg-teal-50 text-teal-800 border border-teal-200/80"
                  }`}
                >
                  {ngo.category}
                </span>
                <h3 className="text-xs sm:text-sm font-bold text-teal-950 leading-snug font-['Outfit',sans-serif]">
                  {ngo.name}
                </h3>
              </div>
              <p className="text-[11px] text-teal-700/80 mt-2 line-clamp-2">
                {ngo.focusArea}
              </p>
            </button>
          );
        })}
      </div>

      {/* Main NGO Details & Transparency Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: NGO Profile & Transparent Breakdown of Proceeds */}
        <div className="lg:col-span-7 mosaic-card rounded-2xl p-6 space-y-5">
          {/* NGO Info */}
          <div>
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <span className="text-[10px] uppercase font-bold text-teal-800 bg-teal-50 border border-teal-200/80 px-2.5 py-0.5 rounded-md">
                  Verified Disaster Partner
                </span>
                <h2 className="text-lg font-bold text-teal-950 mt-1.5 font-['Outfit',sans-serif]">
                  {activeNgo.name}
                </h2>
              </div>
            </div>

            <p className="text-xs text-teal-800/80 leading-relaxed">
              {activeNgo.aboutNgo}
            </p>

            {/* Registration badges */}
            <div className="mt-3 p-3 bg-white/95 rounded-xl border border-teal-900/10 space-y-1 text-[11px] text-teal-800/80 shadow-2xs">
              <div><strong>Registration:</strong> {activeNgo.ngoRegDetails}</div>
              <div><strong>Darpan Portal ID:</strong> <span className="font-mono">{activeNgo.darpanId}</span></div>
              <div className="text-teal-800 font-bold"><strong>Tax Exemption:</strong> {activeNgo.taxExemption}</div>
            </div>
          </div>

          {/* How all the proceeds will be gone to the fund itself */}
          <div className="pt-2 border-t border-teal-900/10">
            <div className="flex items-center gap-2 mb-2">
              <PieChart className="w-4 h-4 text-teal-700" />
              <h3 className="text-xs sm:text-sm font-bold text-teal-950 font-['Outfit',sans-serif]">
                How 100% of Proceeds are Utilized
              </h3>
            </div>
            <p className="text-[11px] text-teal-800/80 mb-3">
              Directly audited and disbursed to flood-hit families with zero administrative overhead.
            </p>

            {/* Visual Progress Stack */}
            <div className="w-full h-3 rounded-full overflow-hidden flex bg-teal-100 mb-3">
              {activeNgo.proceedsBreakdown.map((item, idx) => {
                const colors = ["#0f766e", "#14b8a6", "#2dd4bf", "#fbbf24"];
                return (
                  <div
                    key={idx}
                    style={{ width: `${item.percentage}%`, backgroundColor: colors[idx % colors.length] }}
                    title={`${item.item}: ${item.percentage}%`}
                  />
                );
              })}
            </div>

            {/* Breakdown Cards */}
            <div className="space-y-2">
              {activeNgo.proceedsBreakdown.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-white/95 border border-teal-900/10 flex items-start justify-between gap-3 text-xs shadow-2xs"
                >
                  <div className="flex-1">
                    <div className="font-bold text-teal-950 flex items-center gap-2 font-['Outfit',sans-serif]">
                      <span>{item.item}</span>
                    </div>
                    <p className="text-[11px] text-teal-800/80 mt-0.5 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  <span className="font-mono font-bold text-xs text-teal-800 bg-teal-50 border border-teal-200/80 px-2 py-0.5 rounded-md shrink-0">
                    {item.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Donation Form & Live UPI QR Code */}
        <div className="lg:col-span-5 mosaic-card rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-teal-950 flex items-center gap-2 font-['Outfit',sans-serif]">
            <QrCode className="w-4 h-4 text-teal-700" />
            <span>Donate via UPI (GPay, PhonePe, Paytm)</span>
          </h3>

          {/* Amount presets */}
          <div>
            <label className="block text-xs font-semibold text-teal-800/80 mb-1.5">
              Select Donation in INR (₹)
            </label>
            <div className="grid grid-cols-5 gap-1.5 mb-2">
              {activeNgo.suggestedAmounts.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => {
                    setSelectedAmount(amt);
                    setCustomAmount("");
                    setReceipt(null);
                  }}
                  className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedAmount === amt && !customAmount
                      ? "bg-teal-800 text-white shadow-xs"
                      : "bg-white border border-teal-900/15 text-teal-950 hover:border-teal-400"
                  }`}
                >
                  ₹{amt}
                </button>
              ))}
            </div>
            <input
              type="number"
              placeholder="Or enter custom amount in ₹"
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value);
                setReceipt(null);
              }}
              className="w-full px-3 py-2 text-xs bg-white border border-teal-900/15 rounded-lg text-teal-950 font-bold focus:border-teal-600 outline-none"
            />
          </div>

          {/* Live UPI QR Code */}
          <div className="text-center p-3 bg-white/95 rounded-xl border border-teal-900/10 shadow-2xs">
            <div className="bg-white p-2 rounded-lg inline-block border border-teal-900/10 shadow-2xs mb-2">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="UPI QR Code"
                  className="w-40 h-40 object-contain mx-auto"
                />
              ) : (
                <div className="w-40 h-40 flex items-center justify-center text-xs text-teal-600">
                  Loading QR...
                </div>
              )}
            </div>

            <div className="bg-teal-50/70 border border-teal-900/10 rounded-lg p-2 flex items-center justify-between gap-2 max-w-xs mx-auto">
              <div className="text-left truncate">
                <div className="text-[9px] uppercase font-bold text-teal-700/80">Official UPI ID</div>
                <div className="text-xs font-mono font-bold text-teal-950 truncate">{activeNgo.upiId}</div>
              </div>
              <button
                type="button"
                onClick={handleCopyUpi}
                className="px-2.5 py-1 bg-white hover:bg-teal-50 text-teal-950 border border-teal-900/15 rounded-md text-xs font-semibold transition-colors flex items-center gap-1 shrink-0 cursor-pointer shadow-2xs"
              >
                {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedUpi ? "Copied" : "Copy"}</span>
              </button>
            </div>
          </div>

          {/* Form to generate 80G Receipt */}
          <form onSubmit={handleSimulateDonation} className="space-y-2.5 pt-2 border-t border-teal-900/10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-teal-950 mb-0.5 font-['Outfit',sans-serif]">
                  Donor Full Name
                </label>
                <input
                  type="text"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  required
                  className="w-full px-2.5 py-1.5 text-xs bg-teal-50/50 border border-teal-900/15 rounded-lg text-teal-950 focus:border-teal-600 outline-none font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-teal-950 mb-0.5 font-['Outfit',sans-serif]">
                  PAN Number (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. ABCDE1234F"
                  value={donorPan}
                  onChange={(e) => setDonorPan(e.target.value.toUpperCase())}
                  maxLength={10}
                  className="w-full px-2.5 py-1.5 text-xs bg-teal-50/50 border border-teal-900/15 rounded-lg text-teal-950 font-mono focus:border-teal-600 outline-none font-semibold"
                />
              </div>
            </div>

            <button
              type="submit"
              id="btn-confirm-ngo-donation"
              className="w-full py-2.5 bg-teal-800 hover:bg-teal-900 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm Contribution of ₹{effectiveAmount.toLocaleString()} & Get 80G Receipt</span>
            </button>
          </form>

          {/* Digital 80G Tax Exemption Receipt */}
          {receipt && (
            <div className="p-4 bg-emerald-50/90 border border-emerald-300 rounded-xl shadow-2xs animate-fadeIn text-xs space-y-2">
              <div className="flex items-center justify-between pb-1.5 border-b border-emerald-200">
                <div className="flex items-center gap-1.5 font-bold text-emerald-900 font-['Outfit',sans-serif]">
                  <FileText className="w-4 h-4 text-emerald-700" />
                  <span>80G Tax Exemption Receipt</span>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md border border-emerald-200">
                  VERIFIED
                </span>
              </div>

              <div className="space-y-1 text-emerald-950">
                <div className="flex justify-between">
                  <span>Receipt No:</span>
                  <span className="font-mono font-bold">{receipt.transactionId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Donor:</span>
                  <span className="font-bold">{receipt.donorName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span className="font-bold text-emerald-800">₹{receipt.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Recipient NGO/Fund:</span>
                  <span className="font-semibold">{receipt.cause}</span>
                </div>
              </div>

              <p className="text-[10px] text-emerald-800/80 pt-1 text-center border-t border-emerald-200 font-medium">
                Eligible for 100% deduction under Section 80G. Thank you for saving lives!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
