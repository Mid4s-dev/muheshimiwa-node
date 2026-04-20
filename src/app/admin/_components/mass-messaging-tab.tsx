"use client";

import { useMemo, useState } from "react";
import { api } from "~/trpc/react";

type TabId = "composer" | "contacts" | "smtp";
type Channel = "email" | "sms";
type AudienceMode = "ward" | "selected" | "single";

const tabs: Array<{ id: TabId; label: string }> = [
  { id: "composer", label: "Composer" },
  { id: "contacts", label: "Contacts" },
  { id: "smtp", label: "SMTP" },
];

export function MassMessagingTab() {
  const [activeTab, setActiveTab] = useState<TabId>("composer");
  const [channel, setChannel] = useState<Channel>("email");
  const [audienceMode, setAudienceMode] = useState<AudienceMode>("ward");
  const [selectedWard, setSelectedWard] = useState("");
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);

  const [emailSubject, setEmailSubject] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [singleName, setSingleName] = useState("");
  const [singleEmail, setSingleEmail] = useState("");
  const [singlePhone, setSinglePhone] = useState("");

  const [smtpForm, setSmtpForm] = useState({
    host: "",
    port: 587,
    secure: false,
    user: "",
    password: "",
    from: "",
    testTo: "",
  });

  const { data: wards } = api.mailingList.getAllWards.useQuery();
  const { data: stats } = api.mailingList.getStats.useQuery();
  const { data: contacts = [], refetch: refetchContacts } = api.mailingList.getAll.useQuery({
    status: "active",
    ward: selectedWard || undefined,
  });

  const smtpSettings = api.admin.getSmtpSettings.useQuery(undefined, {
    staleTime: 30000,
  });

  const saveSmtpMutation = api.admin.updateSmtpSettings.useMutation({
    onSuccess: async () => {
      await smtpSettings.refetch();
      setSmtpForm((prev) => ({ ...prev, password: "" }));
      alert("SMTP settings updated.");
    },
    onError: (error) => {
      alert(`SMTP update failed: ${error.message}`);
    },
  });

  const testSmtpMutation = api.admin.sendSmtpTest.useMutation({
    onSuccess: (result) => {
      alert(result.message);
    },
    onError: (error) => {
      alert(`SMTP test failed: ${error.message}`);
    },
  });

  const sendEmailMutation = api.mailingList.sendMassEmail.useMutation({
    onSuccess: (result) => {
      alert(result.message);
      setEmailSubject("");
      setMessageBody("");
      setSingleEmail("");
      setSingleName("");
    },
    onError: (error) => {
      alert(`Email failed: ${error.message}`);
    },
  });

  const sendSmsMutation = api.mailingList.sendMassSMS.useMutation({
    onSuccess: (result) => {
      alert(result.message);
      setMessageBody("");
      setSinglePhone("");
    },
    onError: (error) => {
      alert(`SMS failed: ${error.message}`);
    },
  });

  const isSending = sendEmailMutation.isPending || sendSmsMutation.isPending;

  const contactCount = useMemo(() => {
    if (audienceMode === "selected") {
      return selectedContacts.length;
    }
    if (audienceMode === "ward") {
      return selectedWard ? contacts.length : 0;
    }
    return 1;
  }, [audienceMode, selectedContacts.length, selectedWard, contacts.length]);

  const toggleContact = (id: string) => {
    setSelectedContacts((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const toggleAllContacts = () => {
    if (selectedContacts.length === contacts.length) {
      setSelectedContacts([]);
      return;
    }

    setSelectedContacts(contacts.map((contact) => contact.id));
  };

  const handleSend = async () => {
    if (!messageBody.trim()) {
      alert("Enter a message first.");
      return;
    }

    if (channel === "email" && !emailSubject.trim()) {
      alert("Enter an email subject.");
      return;
    }

    if (channel === "sms" && messageBody.trim().length > 160) {
      alert("SMS message must be 160 characters or less.");
      return;
    }

    if (audienceMode === "ward" && !selectedWard) {
      alert("Choose a ward.");
      return;
    }

    if (audienceMode === "selected" && selectedContacts.length === 0) {
      alert("Select at least one contact.");
      return;
    }

    if (audienceMode === "single") {
      if (channel === "email" && !singleEmail.trim()) {
        alert("Enter recipient email.");
        return;
      }
      if (channel === "sms" && !singlePhone.trim()) {
        alert("Enter recipient phone.");
        return;
      }
    }

    if (channel === "email") {
      await sendEmailMutation.mutateAsync({
        subject: emailSubject,
        message: messageBody,
        ward: audienceMode === "ward" ? selectedWard : undefined,
        selectedContacts: audienceMode === "selected" ? selectedContacts : undefined,
        singleRecipientEmail: audienceMode === "single" ? singleEmail.trim() : undefined,
        singleRecipientName: audienceMode === "single" ? singleName.trim() || "Supporter" : undefined,
      });
      return;
    }

    await sendSmsMutation.mutateAsync({
      message: messageBody,
      ward: audienceMode === "ward" ? selectedWard : undefined,
      selectedContacts: audienceMode === "selected" ? selectedContacts : undefined,
      singleRecipientPhone: audienceMode === "single" ? singlePhone.trim() : undefined,
    });
  };

  const handleSaveSmtp = async () => {
    if (!smtpForm.host.trim() || !smtpForm.user.trim() || !smtpForm.from.trim()) {
      alert("Host, user, and from email are required.");
      return;
    }

    await saveSmtpMutation.mutateAsync({
      host: smtpForm.host.trim(),
      port: smtpForm.port,
      secure: smtpForm.secure,
      user: smtpForm.user.trim(),
      password: smtpForm.password.trim() || undefined,
      from: smtpForm.from.trim(),
    });
  };

  const handleTestSmtp = async () => {
    if (!smtpForm.testTo.trim()) {
      alert("Enter a test email recipient.");
      return;
    }

    await testSmtpMutation.mutateAsync({ to: smtpForm.testTo.trim() });
  };

  const syncFromLoadedSmtp = () => {
    const loaded = smtpSettings.data;
    if (!loaded) return;

    setSmtpForm((prev) => ({
      ...prev,
      host: loaded.host,
      port: loaded.port,
      secure: loaded.secure,
      user: loaded.user,
      from: loaded.from,
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3">
        <img src="/icons/logo.png" alt="Mejja Donk logo" className="h-10 w-10 rounded-full border border-gray-200 object-cover" />
        <div>
          <p className="text-sm font-bold text-gray-900">Mejja Donk Messaging Console</p>
          <p className="text-xs text-gray-600">Send campaign updates through Email and Mobitech SMS</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <Metric label="Total" value={stats?.total ?? 0} tone="blue" />
        <Metric label="Active" value={stats?.active ?? 0} tone="green" />
        <Metric label="With Email" value={stats?.withEmail ?? 0} tone="gold" />
        <Metric label="Unsubscribed" value={stats?.unsubscribed ?? 0} tone="red" />
        <Metric label="Blocked" value={stats?.blocked ?? 0} tone="purple" />
      </div>

      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              activeTab === tab.id ? "bg-md-green text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "composer" && (
        <div className="space-y-5 rounded-xl border border-gray-200 bg-white p-5">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Channel</label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value as Channel)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              >
                <option value="email">Email</option>
                <option value="sms">SMS (Mobitech)</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Audience</label>
              <select
                value={audienceMode}
                onChange={(e) => setAudienceMode(e.target.value as AudienceMode)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              >
                <option value="ward">By ward</option>
                <option value="selected">Selected contacts</option>
                <option value="single">Single recipient</option>
              </select>
            </div>
            <div className="rounded-lg bg-gray-50 px-3 py-2">
              <p className="text-xs uppercase text-gray-500">Target count</p>
              <p className="text-xl font-bold text-gray-900">{contactCount}</p>
            </div>
          </div>

          {audienceMode === "ward" && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Ward</label>
              <select
                value={selectedWard}
                onChange={(e) => setSelectedWard(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              >
                <option value="">Choose ward</option>
                {wards?.map((ward) => (
                  <option key={ward} value={ward}>
                    {ward}
                  </option>
                ))}
              </select>
            </div>
          )}

          {audienceMode === "selected" && (
            <p className="rounded-lg bg-yellow-50 px-3 py-2 text-sm text-yellow-800">
              Pick contacts in the Contacts tab first. Currently selected: {selectedContacts.length}
            </p>
          )}

          {audienceMode === "single" && channel === "email" && (
            <div className="grid gap-3 md:grid-cols-2">
              <input
                value={singleName}
                onChange={(e) => setSingleName(e.target.value)}
                placeholder="Recipient name (optional)"
                className="rounded-lg border border-gray-300 px-3 py-2"
              />
              <input
                value={singleEmail}
                onChange={(e) => setSingleEmail(e.target.value)}
                placeholder="Recipient email"
                className="rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>
          )}

          {audienceMode === "single" && channel === "sms" && (
            <input
              value={singlePhone}
              onChange={(e) => setSinglePhone(e.target.value)}
              placeholder="Recipient phone (e.g. 0712345678 or +254712345678)"
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          )}

          {channel === "email" && (
            <input
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              placeholder="Email subject"
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          )}

          <div>
            <textarea
              value={messageBody}
              onChange={(e) => setMessageBody(e.target.value)}
              rows={channel === "email" ? 8 : 4}
              placeholder={channel === "email" ? "Type campaign email body..." : "Type SMS message (max 160 chars)..."}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            />
            {channel === "sms" && (
              <p className={`mt-1 text-xs ${messageBody.length > 160 ? "text-red-600" : "text-gray-500"}`}>
                {messageBody.length} / 160 characters
              </p>
            )}
          </div>

          <button
            onClick={handleSend}
            disabled={isSending}
            className="rounded-lg bg-md-green px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {isSending ? "Sending..." : `Send ${channel === "email" ? "Email" : "SMS"}`}
          </button>
        </div>
      )}

      {activeTab === "contacts" && (
        <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex flex-wrap gap-3">
            <select
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2"
            >
              <option value="">All wards</option>
              {wards?.map((ward) => (
                <option key={ward} value={ward}>
                  {ward}
                </option>
              ))}
            </select>
            <button
              onClick={() => void refetchContacts()}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700"
            >
              Refresh
            </button>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={selectedContacts.length === contacts.length && contacts.length > 0} onChange={toggleAllContacts} />
            <span>Select all ({selectedContacts.length}/{contacts.length})</span>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left">Name</th>
                  <th className="px-3 py-2 text-left">Phone</th>
                  <th className="px-3 py-2 text-left">Email</th>
                  <th className="px-3 py-2 text-left">Ward</th>
                  <th className="px-3 py-2 text-left">Pick</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact) => (
                  <tr key={contact.id} className="border-t border-gray-200">
                    <td className="px-3 py-2">{contact.name}</td>
                    <td className="px-3 py-2">{contact.phoneNumber}</td>
                    <td className="px-3 py-2">{contact.email ?? "-"}</td>
                    <td className="px-3 py-2">{contact.ward ?? "-"}</td>
                    <td className="px-3 py-2">
                      <input
                        type="checkbox"
                        checked={selectedContacts.includes(contact.id)}
                        onChange={() => toggleContact(contact.id)}
                      />
                    </td>
                  </tr>
                ))}
                {contacts.length === 0 && (
                  <tr>
                    <td className="px-3 py-6 text-center text-gray-500" colSpan={5}>
                      No contacts found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "smtp" && (
        <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-lg font-semibold text-gray-900">SMTP Settings</h3>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${smtpSettings.data?.configured ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
              {smtpSettings.data?.configured ? "Configured" : "Not configured"}
            </span>
            <button
              onClick={syncFromLoadedSmtp}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700"
            >
              Load current values
            </button>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <input
              value={smtpForm.host}
              onChange={(e) => setSmtpForm((prev) => ({ ...prev, host: e.target.value }))}
              placeholder="SMTP host"
              className="rounded-lg border border-gray-300 px-3 py-2"
            />
            <input
              type="number"
              value={smtpForm.port}
              onChange={(e) => setSmtpForm((prev) => ({ ...prev, port: Number(e.target.value) || 587 }))}
              placeholder="Port"
              className="rounded-lg border border-gray-300 px-3 py-2"
            />
            <input
              value={smtpForm.user}
              onChange={(e) => setSmtpForm((prev) => ({ ...prev, user: e.target.value }))}
              placeholder="SMTP user"
              className="rounded-lg border border-gray-300 px-3 py-2"
            />
            <input
              type="password"
              value={smtpForm.password}
              onChange={(e) => setSmtpForm((prev) => ({ ...prev, password: e.target.value }))}
              placeholder="SMTP password (leave blank to keep current)"
              className="rounded-lg border border-gray-300 px-3 py-2"
            />
            <input
              value={smtpForm.from}
              onChange={(e) => setSmtpForm((prev) => ({ ...prev, from: e.target.value }))}
              placeholder="From email"
              className="rounded-lg border border-gray-300 px-3 py-2"
            />
            <label className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={smtpForm.secure}
                onChange={(e) => setSmtpForm((prev) => ({ ...prev, secure: e.target.checked }))}
              />
              Use secure TLS
            </label>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleSaveSmtp}
              disabled={saveSmtpMutation.isPending}
              className="rounded-lg bg-md-green px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {saveSmtpMutation.isPending ? "Saving..." : "Save SMTP settings"}
            </button>
          </div>

          <div className="grid gap-3 md:grid-cols-[1fr_auto]">
            <input
              value={smtpForm.testTo}
              onChange={(e) => setSmtpForm((prev) => ({ ...prev, testTo: e.target.value }))}
              placeholder="Test recipient email"
              className="rounded-lg border border-gray-300 px-3 py-2"
            />
            <button
              onClick={handleTestSmtp}
              disabled={testSmtpMutation.isPending}
              className="rounded-lg border border-md-green px-4 py-2 text-sm font-semibold text-md-green disabled:opacity-60"
            >
              {testSmtpMutation.isPending ? "Testing..." : "Send test email"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Metric({ label, value, tone }: { label: string; value: number; tone: "blue" | "green" | "gold" | "red" | "purple" }) {
  const toneClass = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-green-50 text-green-700",
    gold: "bg-yellow-50 text-yellow-700",
    red: "bg-red-50 text-red-700",
    purple: "bg-purple-50 text-purple-700",
  }[tone];

  return (
    <div className={`rounded-lg p-3 ${toneClass}`}>
      <p className="text-xs uppercase tracking-wide">{label}</p>
      <p className="mt-1 text-xl font-bold">{value}</p>
    </div>
  );
}
