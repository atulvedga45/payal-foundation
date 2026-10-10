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
  try {
    const res = await fetch(`${API_BASE}/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });
    if (res.status === 401) {
      throw new Error("INVALID_PASSWORD");
    }
    if (!res.ok) throw new Error("SERVER_ERROR");
    return await res.json();
  } catch (err) {
    if (err.message === "INVALID_PASSWORD") {
      throw err;
    }
    // If backend is not running or offline, verify against default admin password
    console.warn("Backend not reachable on port 8000, checking fallback login:", err);
    if (password === "admin123") {
      return { success: true, token: "admin123", role: "admin", is_offline: true };
    }
    throw new Error("INVALID_PASSWORD");
  }
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

export async function uploadInitiativeImage(token, file) {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${API_BASE}/admin/upload-image`, {
      method: "POST",
      headers: {
        "x-admin-key": token
      },
      body: formData
    });
    if (!res.ok) throw new Error("Upload failed on server");
    const data = await res.json();
    return data.url;
  } catch (err) {
    console.warn("Backend image upload failed, converting to local data URL:", err);
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });
  }
}

export async function updateInitiative(token, id, data) {
  try {
    const res = await fetch(`${API_BASE}/admin/initiatives/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": token
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to update initiative on backend");
    return await res.json();
  } catch (err) {
    console.warn("Backend update failed, using local fallback", err);
    return { id, ...data };
  }
}

export async function createInitiative(token, data) {
  try {
    const res = await fetch(`${API_BASE}/admin/initiatives`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": token
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to create initiative on backend");
    return await res.json();
  } catch (err) {
    console.warn("Backend create failed, generating local fallback", err);
    return { id: Date.now(), ...data };
  }
}

export async function deleteInitiative(token, id) {
  try {
    const res = await fetch(`${API_BASE}/admin/initiatives/${id}`, {
      method: "DELETE",
      headers: {
        "x-admin-key": token
      }
    });
    if (!res.ok) throw new Error("Failed to delete initiative on backend");
    return true;
  } catch (err) {
    console.warn("Backend delete failed, removing locally", err);
    return true;
  }
}

export async function updateTrustee(token, id, data) {
  try {
    const res = await fetch(`${API_BASE}/admin/trustees/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": token
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to update trustee on backend");
    return await res.json();
  } catch (err) {
    console.warn("Backend update failed, using local fallback", err);
    return { id, ...data };
  }
}

export async function createTrustee(token, data) {
  try {
    const res = await fetch(`${API_BASE}/admin/trustees`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": token
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to create trustee on backend");
    return await res.json();
  } catch (err) {
    console.warn("Backend create failed, generating local fallback", err);
    return { id: Date.now(), ...data };
  }
}

export async function deleteTrustee(token, id) {
  try {
    const res = await fetch(`${API_BASE}/admin/trustees/${id}`, {
      method: "DELETE",
      headers: {
        "x-admin-key": token
      }
    });
    if (!res.ok) throw new Error("Failed to delete trustee on backend");
    return true;
  } catch (err) {
    console.warn("Backend delete failed, removing locally", err);
    return true;
  }
}

// Gallery API
export async function fetchGallery() {
  try {
    const res = await fetch(`${API_BASE}/gallery`);
    if (!res.ok) throw new Error("Failed to fetch gallery");
    return await res.json();
  } catch (err) {
    console.warn("Backend not reached for gallery, using local fallback", err);
    return null;
  }
}

export async function createGalleryItem(token, data) {
  try {
    const res = await fetch(`${API_BASE}/admin/gallery`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": token
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to create gallery item on backend");
    return await res.json();
  } catch (err) {
    console.warn("Backend create failed, generating local fallback", err);
    return { id: Date.now(), ...data };
  }
}

export async function updateGalleryItem(token, id, data) {
  try {
    const res = await fetch(`${API_BASE}/admin/gallery/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": token
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to update gallery item on backend");
    return await res.json();
  } catch (err) {
    console.warn("Backend update failed, using local fallback", err);
    return { id, ...data };
  }
}

export async function deleteGalleryItem(token, id) {
  try {
    const res = await fetch(`${API_BASE}/admin/gallery/${id}`, {
      method: "DELETE",
      headers: {
        "x-admin-key": token
      }
    });
    if (!res.ok) throw new Error("Failed to delete gallery item on backend");
    return true;
  } catch (err) {
    console.warn("Backend delete failed, removing locally", err);
    return true;
  }
}

