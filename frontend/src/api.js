const API_BASE = "http://localhost:8000/api";

export async function fetchTrustInfo() {
  try {
    const res = await fetch(`${API_BASE}/info`);
    if (!res.ok) throw new Error("Failed to fetch info");
    return await res.json();
  } catch (err) {
    console.warn("Backend not reached for trust info, using local defaults", err);
    return null;
  }
}

export async function fetchTrustees() {
  try {
    const res = await fetch(`${API_BASE}/trustees`);
    if (!res.ok) throw new Error("Failed to fetch trustees");
    return await res.json();
  } catch (err) {
    console.warn("Backend not reached for trustees, using local fallback", err);
    return null;
  }
}

export async function fetchInitiatives() {
  try {
    const res = await fetch(`${API_BASE}/initiatives`);
    if (!res.ok) throw new Error("Failed to fetch initiatives");
    return await res.json();
  } catch (err) {
    console.warn("Backend not reached for initiatives, using local fallback", err);
    return null;
  }
}

export async function submitContact(data) {
  const res = await fetch(`${API_BASE}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Failed to submit message");
  return await res.json();
}

export async function submitVolunteer(data) {
  const res = await fetch(`${API_BASE}/volunteer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Failed to submit volunteer application");
  return await res.json();
}

export async function submitDonation(data) {
  const res = await fetch(`${API_BASE}/donations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Failed to submit donation record");
  return await res.json();
}

export async function adminLogin(password) {
  const res = await fetch(`${API_BASE}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password })
  });
  if (!res.ok) throw new Error("Invalid password");
  return await res.json();
}

export async function fetchDashboardStats() {
  const res = await fetch(`${API_BASE}/admin/dashboard`);
  if (!res.ok) throw new Error("Failed to fetch stats");
  return await res.json();
}

export async function fetchAllMessages() {
  const res = await fetch(`${API_BASE}/contact`);
  if (!res.ok) throw new Error("Failed to fetch messages");
  return await res.json();
}

export async function fetchAllVolunteers() {
  const res = await fetch(`${API_BASE}/volunteer`);
  if (!res.ok) throw new Error("Failed to fetch volunteers");
  return await res.json();
}

export async function fetchAllDonations() {
  const res = await fetch(`${API_BASE}/donations`);
  if (!res.ok) throw new Error("Failed to fetch donations");
  return await res.json();
}

export async function fetchHomeStats() {
  try {
    const res = await fetch(`${API_BASE}/home-stats`);
    if (!res.ok) throw new Error("Failed to fetch home stats");
    const data = await res.json();
    if (data) {
      localStorage.setItem("payal_home_stats", JSON.stringify(data));
    }
    return data;
  } catch (err) {
    console.warn("Backend not reached for home stats, falling back to local cache", err);
    const local = localStorage.getItem("payal_home_stats");
    return local ? JSON.parse(local) : null;
  }
}

export async function updateHomeStats(token, data) {
  // Always update local cache immediately so UI reacts instantly
  localStorage.setItem("payal_home_stats", JSON.stringify(data));
  try {
    const res = await fetch(`${API_BASE}/admin/home-stats`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": token
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      console.warn("Backend update returned non-OK, using local saved data");
    } else {
      const serverData = await res.json();
      localStorage.setItem("payal_home_stats", JSON.stringify(serverData));
      return serverData;
    }
  } catch (err) {
    console.warn("Backend unreachable for saving home stats, saved locally in browser", err);
  }
  return data;
}
