"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

export function MassMessagingTab() {
  const [activeSubTab, setActiveSubTab] = useState<"email" | "sms" | "contacts">("email");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [smsMessage, setSmsMessage] = useState("");
  const [selectedWard, setSelectedWard] = useState<string>("");
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [useWard, setUseWard] = useState(true);

  // Queries
  const { data: wards } = api.mailingList.getAllWards.useQuery();
  const { data: stats } = api.mailingList.getStats.useQuery();
  const { data: contacts, refetch: refetchContacts } = api.mailingList.getAll.useQuery(
    {
      ward: useWard ? selectedWard : undefined,
      status: "active",
    },
    { enabled: activeSubTab === "contacts" || (useWard && selectedWard !== "") }
  );

  // Mutations
  const sendEmailMutation = api.mailingList.sendMassEmail.useMutation({
    onSuccess: (data) => {
      alert(`✅ ${data.message}`);
      setEmailSubject("");
      setEmailMessage("");
      setSelectedContacts([]);
    },
    onError: (error) => {
      alert(`❌ Error: ${error.message}`);
    },
  });

  const sendSmsMutation = api.mailingList.sendMassSMS.useMutation({
    onSuccess: (data) => {
      alert(`✅ ${data.message}`);
      setSmsMessage("");
      setSelectedContacts([]);
    },
    onError: (error) => {
      alert(`❌ Error: ${error.message}`);
    },
  });

  const handleSendEmail = async () => {
    if (!emailSubject.trim()) {
      alert("Please enter email subject");
      return;
    }
    if (!emailMessage.trim()) {
      alert("Please enter email message");
      return;
    }
    if (!useWard && selectedContacts.length === 0) {
      alert("Please select contacts");
      return;
    }
    if (useWard && !selectedWard) {
      alert("Please select a ward");
      return;
    }

    await sendEmailMutation.mutateAsync({
      subject: emailSubject,
      message: emailMessage,
      selectedContacts: !useWard ? selectedContacts : undefined,
      ward: useWard ? selectedWard : undefined,
    });
  };

  const handleSendSMS = async () => {
    if (!smsMessage.trim()) {
      alert("Please enter SMS message");
      return;
    }
    if (smsMessage.length > 160) {
      alert("SMS message is too long (max 160 characters)");
      return;
    }
    if (!useWard && selectedContacts.length === 0) {
      alert("Please select contacts");
      return;
    }
    if (useWard && !selectedWard) {
      alert("Please select a ward");
      return;
    }

    await sendSmsMutation.mutateAsync({
      message: smsMessage,
      selectedContacts: !useWard ? selectedContacts : undefined,
      ward: useWard ? selectedWard : undefined,
    });
  };

  const toggleContact = (id: string) => {
    setSelectedContacts((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const toggleAllContacts = () => {
    if (selectedContacts.length === (contacts?.length ?? 0)) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts((contacts ?? []).map((c) => c.id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <div className="rounded-lg bg-blue-50 p-4">
          <p className="text-sm font-medium text-gray-600">Total Contacts</p>
          <p className="mt-2 text-2xl font-bold text-blue-600">{stats?.total ?? 0}</p>
        </div>
        <div className="rounded-lg bg-green-50 p-4">
          <p className="text-sm font-medium text-gray-600">Active</p>
          <p className="mt-2 text-2xl font-bold text-green-600">{stats?.active ?? 0}</p>
        </div>
        <div className="rounded-lg bg-yellow-50 p-4">
          <p className="text-sm font-medium text-gray-600">With Email</p>
          <p className="mt-2 text-2xl font-bold text-yellow-600">{stats?.withEmail ?? 0}</p>
        </div>
        <div className="rounded-lg bg-red-50 p-4">
          <p className="text-sm font-medium text-gray-600">Unsubscribed</p>
          <p className="mt-2 text-2xl font-bold text-red-600">{stats?.unsubscribed ?? 0}</p>
        </div>
        <div className="rounded-lg bg-purple-50 p-4">
          <p className="text-sm font-medium text-gray-600">Blocked</p>
          <p className="mt-2 text-2xl font-bold text-purple-600">{stats?.blocked ?? 0}</p>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex space-x-4 border-b border-gray-200">
        <button
          onClick={() => setActiveSubTab("email")}
          className={`px-4 py-2 font-medium ${
            activeSubTab === "email"
              ? "border-b-2 border-md-green text-md-green"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          📧 Send Email Campaign
        </button>
        <button
          onClick={() => setActiveSubTab("sms")}
          className={`px-4 py-2 font-medium ${
            activeSubTab === "sms"
              ? "border-b-2 border-md-green text-md-green"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          📱 Send SMS Campaign
        </button>
        <button
          onClick={() => setActiveSubTab("contacts")}
          className={`px-4 py-2 font-medium ${
            activeSubTab === "contacts"
              ? "border-b-2 border-md-green text-md-green"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          👥 Manage Contacts
        </button>
      </div>

      {/* Email Campaign */}
      {activeSubTab === "email" && (
        <div className="space-y-4 rounded-lg bg-white p-6">
          <h3 className="text-lg font-semibold text-gray-900">Send Email Campaign</h3>

          {/* Target Selection */}
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                checked={useWard}
                onChange={() => setUseWard(true)}
                className="h-4 w-4 cursor-pointer"
              />
              <span className="text-sm text-gray-700">Send to Ward</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                checked={!useWard}
                onChange={() => setUseWard(false)}
                className="h-4 w-4 cursor-pointer"
              />
              <span className="text-sm text-gray-700">Send to Selected Contacts</span>
            </label>
          </div>

          {/* Ward Selection */}
          {useWard && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Select Ward</label>
              <select
                value={selectedWard}
                onChange={(e) => setSelectedWard(e.target.value)}
                className="mt-1 block w-full rounded-lg border-2 border-gray-300 px-3 py-2 focus:border-md-green focus:outline-none"
              >
                <option value="">-- Choose a ward --</option>
                {wards?.map((ward) => (
                  <option key={ward} value={ward}>
                    {ward}
                  </option>
                ))}
              </select>
              {selectedWard && (
                <p className="mt-2 text-sm text-gray-600">
                  This will send to all active contacts in {selectedWard}
                </p>
              )}
            </div>
          )}

          {/* Email Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Subject</label>
            <input
              type="text"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              placeholder="e.g., Important Update from Muheshimiwa Campaign"
              className="mt-1 block w-full rounded-lg border-2 border-gray-300 px-3 py-2 focus:border-md-green focus:outline-none"
            />
          </div>

          {/* Email Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Message</label>
            <textarea
              value={emailMessage}
              onChange={(e) => setEmailMessage(e.target.value)}
              placeholder="Enter your email message here..."
              rows={6}
              className="mt-1 block w-full rounded-lg border-2 border-gray-300 px-3 py-2 focus:border-md-green focus:outline-none"
            />
            <p className="mt-1 text-xs text-gray-500">
              {emailMessage.length > 0 ? `${emailMessage.length} characters` : ""}
            </p>
          </div>

          <button
            onClick={handleSendEmail}
            disabled={sendEmailMutation.isPending}
            className="rounded-lg bg-md-green px-6 py-2 font-medium text-white transition hover:bg-opacity-90 disabled:opacity-50"
          >
            {sendEmailMutation.isPending ? "Sending..." : "Send Email Campaign"}
          </button>
        </div>
      )}

      {/* SMS Campaign */}
      {activeSubTab === "sms" && (
        <div className="space-y-4 rounded-lg bg-white p-6">
          <h3 className="text-lg font-semibold text-gray-900">Send SMS Campaign</h3>

          {/* Target Selection */}
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                checked={useWard}
                onChange={() => setUseWard(true)}
                className="h-4 w-4 cursor-pointer"
              />
              <span className="text-sm text-gray-700">Send to Ward</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                checked={!useWard}
                onChange={() => setUseWard(false)}
                className="h-4 w-4 cursor-pointer"
              />
              <span className="text-sm text-gray-700">Send to Selected Contacts</span>
            </label>
          </div>

          {/* Ward Selection */}
          {useWard && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Select Ward</label>
              <select
                value={selectedWard}
                onChange={(e) => setSelectedWard(e.target.value)}
                className="mt-1 block w-full rounded-lg border-2 border-gray-300 px-3 py-2 focus:border-md-green focus:outline-none"
              >
                <option value="">-- Choose a ward --</option>
                {wards?.map((ward) => (
                  <option key={ward} value={ward}>
                    {ward}
                  </option>
                ))}
              </select>
              {selectedWard && (
                <p className="mt-2 text-sm text-gray-600">
                  This will send to all active contacts in {selectedWard}
                </p>
              )}
            </div>
          )}

          {/* SMS Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700">SMS Message</label>
            <textarea
              value={smsMessage}
              onChange={(e) => setSmsMessage(e.target.value)}
              placeholder="Enter your SMS message (max 160 characters)..."
              rows={4}
              className="mt-1 block w-full rounded-lg border-2 border-gray-300 px-3 py-2 focus:border-md-green focus:outline-none"
            />
            <div className="mt-1 flex justify-between text-xs text-gray-500">
              <span>{smsMessage.length} / 160 characters</span>
              {smsMessage.length > 160 && <span className="text-red-600">Too long!</span>}
            </div>
          </div>

          <button
            onClick={handleSendSMS}
            disabled={sendSmsMutation.isPending}
            className="rounded-lg bg-md-green px-6 py-2 font-medium text-white transition hover:bg-opacity-90 disabled:opacity-50"
          >
            {sendSmsMutation.isPending ? "Sending..." : "Send SMS Campaign"}
          </button>
        </div>
      )}

      {/* Contacts Management */}
      {activeSubTab === "contacts" && (
        <div className="space-y-4 rounded-lg bg-white p-6">
          <h3 className="text-lg font-semibold text-gray-900">Manage Contacts</h3>

          {/* Filters */}
          <div className="flex space-x-4">
            <select
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
              className="rounded-lg border-2 border-gray-300 px-3 py-2 focus:border-md-green focus:outline-none"
            >
              <option value="">All Wards</option>
              {wards?.map((ward) => (
                <option key={ward} value={ward}>
                  {ward}
                </option>
              ))}
            </select>
          </div>

          {/* Contacts Table */}
          {contacts && contacts.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedContacts.length === contacts.length}
                  onChange={toggleAllContacts}
                  className="h-4 w-4 cursor-pointer"
                />
                <span className="text-sm font-medium text-gray-700">
                  Select All ({selectedContacts.length}/{contacts.length})
                </span>
              </div>

              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Name</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Phone</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Email</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Ward</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-700">Select</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.map((contact) => (
                      <tr key={contact.id} className="border-t border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-3">{contact.name}</td>
                        <td className="px-4 py-3">{contact.phoneNumber}</td>
                        <td className="px-4 py-3">{contact.email ?? "-"}</td>
                        <td className="px-4 py-3">{contact.ward ?? "-"}</td>
                        <td className="px-4 py-3 text-center">
                          <input
                            type="checkbox"
                            checked={selectedContacts.includes(contact.id)}
                            onChange={() => toggleContact(contact.id)}
                            className="h-4 w-4 cursor-pointer"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-600">No contacts found</p>
          )}
        </div>
      )}
    </div>
  );
}
