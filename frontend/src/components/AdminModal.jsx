import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  X, ShieldCheck, DollarSign, Users, MessageSquare, LogOut,
  CheckCircle, RefreshCw, SlidersHorizontal, Save, Heart, HandHeart,
  RotateCcw, Target, Edit3, Trash2, Plus, Image as ImageIcon,
  Upload, ArrowLeft, AlertCircle, Phone, QrCode, UserCheck, Camera,
  ArrowUp, ArrowDown
} from 'lucide-react';
import QRCode from 'qrcode';
import {
  adminLogin,
  fetchDashboardStats,
  fetchAllDonations,
  fetchAllVolunteers,
  fetchAllMessages,
  updateHomeStats,
  updateInitiative,
  createInitiative,
  deleteInitiative,
  uploadInitiativeImage,
  updateTrustee,
  createTrustee,
  deleteTrustee,
  fetchTrustees,
  fetchGallery,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem
} from '../api';

const PRESET_IMAGES = [
  { label: 'अन्नदान व रेशन वाटप', path: '/food_distribution.jpg' },
  { label: 'आरोग्य व वैद्यकीय शिबिर', path: '/healthcare_camp.jpg' },
  { label: 'महिला सबलीकरण', path: '/women_empowerment.jpg' },
  { label: 'युवा शिक्षण व कौशल्य', path: '/img1.jpeg' },
  { label: 'बाल संगोपन व रुग्णालय', path: '/child_healthcare_hospital.jpg' },
  { label: 'समाजकार्य व मदत', path: '/community_outreach.jpg' },
  { label: 'आपत्ती निवारण व नियोजन', path: '/relief_planning.jpeg' }
];

const PRESET_TRUSTEE_PHOTOS = [
  { label: 'Sonya Oghe', path: '/sonya.jpg' },
  { label: 'Payal Foundation Logo', path: '/young_samaj_seva_trust_logo.jpeg' },
  { label: 'युवा प्रतिनिधी', path: '/img1.jpeg' },
  { label: 'समाजसेवक', path: '/relief_planning.jpeg' }
];

const PRESET_GALLERY_CATEGORIES = [
  { mr: 'आरोग्य व रुग्णसेवा', en: 'Healthcare & Medical' },
  { mr: 'सामाजिक कार्य', en: 'Social Service' },
  { mr: 'रुग्णालय सहाय्य', en: 'Healthcare Support' },
  { mr: 'महिला कल्याण व सबलीकरण', en: 'Women Welfare' },
  { mr: 'अन्नदान व रेशन वाटप', en: 'Hunger Relief' },
  { mr: 'आपत्ती निवारण व मदत', en: 'Disaster Relief' },
  { mr: 'शिक्षण व कौशल्य विकास', en: 'Youth & Education' }
];

const PRESET_GALLERY_IMAGES = [
  { label: 'वैद्यकीय व रुग्णालय मदत', path: '/about_initiative.jpg' },
  { label: 'प्रत्यक्ष सामाजिक कार्य', path: '/community_outreach.jpg' },
  { label: 'बालक उपचार व मदत', path: '/child_healthcare_hospital.jpg' },
  { label: 'महिला सबलीकरण व मदत', path: '/women_empowerment.jpg' },
  { label: 'अन्नधान्य व रेशन वाटप', path: '/food_distribution.jpg' },
  { label: 'आरोग्य तपासणी शिबिर', path: '/healthcare_camp.jpg' },
  { label: 'आपत्ती निवारण व मदत', path: '/relief_planning.jpeg' },
  { label: 'विश्वस्त व स्वयंसेवक कार्य', path: '/trustees_group.jpeg' }
];

const DEFAULT_GALLERY_FALLBACK = [
  {
    id: 1,
    image_url: '/about_initiative.jpg',
    title: 'Emergency Medical & Hospital Assistance in Palghar',
    title_mr: 'माणुसकीची साथ: गरजू बाबांना रुग्णालयात नेऊन उपचारासाठी मदत',
    category: 'Healthcare & Compassion',
    category_mr: 'आरोग्य व रुग्णसेवा',
    order: 1
  },
  {
    id: 2,
    image_url: '/community_outreach.jpg',
    title: 'Field Social Work & Community Outreach',
    title_mr: 'विश्वस्त व स्वयंसेवकांचा प्रत्यक्ष सेवा उपक्रम',
    category: 'Social Service',
    category_mr: 'सामाजिक कार्य',
    order: 2
  },
  {
    id: 3,
    image_url: '/child_healthcare_hospital.jpg',
    title: 'Child Healthcare & Patient Care Support in Hospital',
    title_mr: 'रुग्णालय सहाय्य: बालकांवर उपचार व माणुसकीचा आधार',
    category: 'Healthcare Support',
    category_mr: 'रुग्णालय सहाय्य',
    order: 3
  },
  {
    id: 4,
    image_url: '/women_empowerment.jpg',
    title: 'Women Support & Community Assistance',
    title_mr: 'महिला सबलीकरण व प्रत्यक्ष मदत उपक्रम',
    category: 'Women Welfare',
    category_mr: 'महिला कल्याण',
    order: 4
  }
];

export default function AdminModal({
  isOpen,
  onClose,
  homeStats,
  onUpdateHomeStats,
  initiatives = [],
  onUpdateInitiatives,
  trustees = [],
  onUpdateTrustees,
  gallery = [],
  onUpdateGallery
}) {
  const [token, setToken] = useState(localStorage.getItem('admin_token') || '');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('initiatives');
  const [loading, setLoading] = useState(false);

  const [stats, setStats] = useState({
    total_donations_count: 0,
    total_donations_amount: 0,
    total_volunteers_count: 0,
    total_messages_count: 0
  });
  const [donations, setDonations] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [messages, setMessages] = useState([]);

  // Initiatives State
  const [localInitiatives, setLocalInitiatives] = useState(initiatives);
  const [editingInit, setEditingInit] = useState(null);
  const [initSaving, setInitSaving] = useState(false);
  const [initUploading, setInitUploading] = useState(false);
  const [initMsg, setInitMsg] = useState({ type: '', text: '' });
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (initiatives && initiatives.length > 0) {
      setLocalInitiatives(initiatives);
    }
  }, [initiatives]);

  // Trustees State
  const [localTrustees, setLocalTrustees] = useState(trustees);
  const [editingTrustee, setEditingTrustee] = useState(null);
  const [trusteeSaving, setTrusteeSaving] = useState(false);
  const [trusteeUploading, setTrusteeUploading] = useState(false);
  const [trusteeQrUploading, setTrusteeQrUploading] = useState(false);
  const [trusteeMsg, setTrusteeMsg] = useState({ type: '', text: '' });
  const [trusteePreviewQr, setTrusteePreviewQr] = useState('');
  const trusteePhotoRef = useRef(null);
  const trusteeQrRef = useRef(null);

  useEffect(() => {
    if (trustees && trustees.length > 0) {
      setLocalTrustees(trustees);
    }
  }, [trustees]);

  // Generate QR code for trustee live preview
  useEffect(() => {
    if (!editingTrustee) {
      setTrusteePreviewQr('');
      return;
    }
    if (editingTrustee.upi_qr_url) {
      setTrusteePreviewQr(editingTrustee.upi_qr_url);
      return;
    }
    const upi = editingTrustee.upi_id || 'payalfoundation@ybl';
    const payeeName = editingTrustee.name || 'Payal Foundation Trustee';
    QRCode.toDataURL(`upi://pay?pa=${encodeURIComponent(upi)}&pn=${encodeURIComponent(payeeName)}&cu=INR`, {
      width: 240,
      margin: 1,
      color: { dark: '#0f172a', light: '#ffffff' }
    })
      .then(url => setTrusteePreviewQr(url))
      .catch(() => {});
  }, [editingTrustee?.upi_id, editingTrustee?.name, editingTrustee?.upi_qr_url]);

  // Gallery State
  const [localGallery, setLocalGallery] = useState(gallery);
  const [editingGallery, setEditingGallery] = useState(null);
  const [gallerySaving, setGallerySaving] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [galleryMsg, setGalleryMsg] = useState({ type: '', text: '' });
  const galleryFileRef = useRef(null);

  useEffect(() => {
    if (gallery && gallery.length > 0) {
      setLocalGallery(gallery);
    }
  }, [gallery]);

  // Home Stats Form State (Editable Community Dedicated, Active Social Workers, Families Impacted)
  const [statsForm, setStatsForm] = useState({
    stat1_number: '100%',
    stat1_label: 'Community Dedicated',
    stat1_label_mr: 'समाजास समर्पित',
    stat2_number: '50+',
    stat2_label: 'Active Social Workers',
    stat2_label_mr: 'सक्रिय समाजसेवक',
    stat3_number: '10,000+',
    stat3_label: 'Families Impacted',
    stat3_label_mr: 'मदत पोहचलेली कुटुंबे'
  });
  const [statsSaving, setStatsSaving] = useState(false);
  const [statsSuccess, setStatsSuccess] = useState('');

  useEffect(() => {
    if (homeStats) {
      setStatsForm({
        stat1_number: homeStats.stat1_number || '100%',
        stat1_label: homeStats.stat1_label || 'Community Dedicated',
        stat1_label_mr: homeStats.stat1_label_mr || 'समाजास समर्पित',
        stat2_number: homeStats.stat2_number || '50+',
        stat2_label: homeStats.stat2_label || 'Active Social Workers',
        stat2_label_mr: homeStats.stat2_label_mr || 'सक्रिय समाजसेवक',
        stat3_number: homeStats.stat3_number || '10,000+',
        stat3_label: homeStats.stat3_label || 'Families Impacted',
        stat3_label_mr: homeStats.stat3_label_mr || 'मदत पोहचलेली कुटुंबे'
      });
    }
  }, [homeStats, isOpen]);

  const handleSaveHomeStats = async (e) => {
    e.preventDefault();
    setStatsSaving(true);
    setStatsSuccess('');
    try {
      const updated = await updateHomeStats(token, statsForm);
      if (onUpdateHomeStats) {
        onUpdateHomeStats(updated || statsForm);
      }
      setStatsSuccess('होम पेज आकडेवारी यशस्वीरीत्या सेव्ह केली गेली! (Home stats updated live!)');
      setTimeout(() => setStatsSuccess(''), 4500);
    } catch (err) {
      console.error(err);
      if (onUpdateHomeStats) {
        onUpdateHomeStats(statsForm);
      }
      setStatsSuccess('बदल सेव्ह झाले (Local cache updated).');
      setTimeout(() => setStatsSuccess(''), 4500);
    } finally {
      setStatsSaving(false);
    }
  };

  const handleResetDefaults = () => {
    const defaults = {
      stat1_number: '100%',
      stat1_label: 'Community Dedicated',
      stat1_label_mr: 'समाजास समर्पित',
      stat2_number: '50+',
      stat2_label: 'Active Social Workers',
      stat2_label_mr: 'सक्रिय समाजसेवक',
      stat3_number: '10,000+',
      stat3_label: 'Families Impacted',
      stat3_label_mr: 'मदत पोहचलेली कुटुंबे'
    };
    setStatsForm(defaults);
  };

  // Initiative Management Handlers
  const handleEditInitiative = (item) => {
    setEditingInit({ ...item });
    setInitMsg({ type: '', text: '' });
  };

  const handleAddNewInitiative = () => {
    setEditingInit({
      id: 'new',
      title: '',
      title_mr: '',
      description: '',
      description_mr: '',
      category: 'Social Welfare',
      icon: 'Heart',
      image_url: '/food_distribution.jpg',
      target_amount: 100000,
      raised_amount: 0
    });
    setInitMsg({ type: '', text: '' });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setInitUploading(true);
    setInitMsg({ type: '', text: '' });
    try {
      const url = await uploadInitiativeImage(token, file);
      if (url) {
        setEditingInit((prev) => ({ ...prev, image_url: url }));
        setInitMsg({ type: 'success', text: 'फोटो यशस्वीरीत्या अपलोड झाला! (Image uploaded successfully!)' });
      }
    } catch (err) {
      console.error(err);
      setInitMsg({ type: 'error', text: 'फोटो अपलोड करताना अडचण आली.' });
    } finally {
      setInitUploading(false);
    }
  };

  const handleSaveInitiative = async (e) => {
    e.preventDefault();
    if (!editingInit.title.trim()) {
      setInitMsg({ type: 'error', text: 'कृपया उपक्रमाचे नाव (Title) प्रविष्ट करा.' });
      return;
    }
    setInitSaving(true);
    setInitMsg({ type: '', text: '' });
    try {
      let updatedList = [];
      if (editingInit.id === 'new') {
        const payload = {
          ...editingInit,
          title_mr: editingInit.title_mr || editingInit.title,
          description_mr: editingInit.description_mr || editingInit.description,
          target_amount: Number(editingInit.target_amount) || 0,
          raised_amount: Number(editingInit.raised_amount) || 0
        };
        const created = await createInitiative(token, payload);
        updatedList = [created, ...localInitiatives];
      } else {
        const payload = {
          ...editingInit,
          target_amount: Number(editingInit.target_amount) || 0,
          raised_amount: Number(editingInit.raised_amount) || 0
        };
        const saved = await updateInitiative(token, editingInit.id, payload);
        updatedList = localInitiatives.map((item) => item.id === editingInit.id ? (saved || payload) : item);
      }
      setLocalInitiatives(updatedList);
      try {
        localStorage.setItem('payal_initiatives', JSON.stringify(updatedList));
      } catch (_) {}
      if (onUpdateInitiatives) onUpdateInitiatives(updatedList);
      setEditingInit(null);
      setInitMsg({ type: 'success', text: 'उपक्रम यशस्वीरीत्या सेव्ह झाला! (Initiative saved successfully!)' });
      setTimeout(() => setInitMsg({ type: '', text: '' }), 4000);
    } catch (err) {
      console.error(err);
      setInitMsg({ type: 'error', text: 'उपक्रम सेव्ह करताना त्रुटी आली.' });
    } finally {
      setInitSaving(false);
    }
  };

  const handleDeleteInitiative = async (id) => {
    if (!window.confirm('हा उपक्रम खरोखर हटवायचा आहे का? (Are you sure you want to delete this initiative?)')) {
      return;
    }
    try {
      await deleteInitiative(token, id);
      const updatedList = localInitiatives.filter((item) => item.id !== id);
      setLocalInitiatives(updatedList);
      try {
        localStorage.setItem('payal_initiatives', JSON.stringify(updatedList));
      } catch (_) {}
      if (onUpdateInitiatives) onUpdateInitiatives(updatedList);
      setInitMsg({ type: 'success', text: 'उपक्रम यशस्वीरीत्या हटवला गेला! (Initiative deleted!)' });
      setTimeout(() => setInitMsg({ type: '', text: '' }), 4000);
    } catch (err) {
      console.error(err);
      setInitMsg({ type: 'error', text: 'उपक्रम हटवताना त्रुटी आली.' });
    }
  };

  // Trustee Handlers
  const handleTrusteePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setTrusteeUploading(true);
    setTrusteeMsg({ type: '', text: '' });
    try {
      const url = await uploadInitiativeImage(token, file);
      if (url) {
        setEditingTrustee(prev => ({ ...prev, photo_url: url }));
        setTrusteeMsg({ type: 'success', text: 'विश्वस्त फोटो यशस्वीरीत्या अपलोड झाला!' });
      }
    } catch (err) {
      console.error(err);
      setTrusteeMsg({ type: 'error', text: 'फोटो अपलोड करताना त्रुटी आली.' });
    } finally {
      setTrusteeUploading(false);
    }
  };

  const handleTrusteeQrUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setTrusteeQrUploading(true);
    setTrusteeMsg({ type: '', text: '' });
    try {
      const url = await uploadInitiativeImage(token, file);
      if (url) {
        setEditingTrustee(prev => ({ ...prev, upi_qr_url: url }));
        setTrusteeMsg({ type: 'success', text: 'UPI स्कॅनर फोटो यशस्वीरीत्या अपलोड झाला!' });
      }
    } catch (err) {
      console.error(err);
      setTrusteeMsg({ type: 'error', text: 'स्कॅनर फोटो अपलोड करताना त्रुटी आली.' });
    } finally {
      setTrusteeQrUploading(false);
    }
  };

  const handleSaveTrustee = async (e) => {
    e.preventDefault();
    if (!editingTrustee.name?.trim()) {
      setTrusteeMsg({ type: 'error', text: 'कृपया विश्वस्ताचे नाव प्रविष्ट करा.' });
      return;
    }
    setTrusteeSaving(true);
    setTrusteeMsg({ type: '', text: '' });
    try {
      let updatedList = [];
      if (editingTrustee.id === 'new') {
        const payload = {
          name: editingTrustee.name,
          role: editingTrustee.role || 'Trust Member',
          role_mr: editingTrustee.role_mr || 'विश्वस्त सदस्य (Trust Member)',
          photo_url: editingTrustee.photo_url || '/sonya.jpg',
          phone: editingTrustee.phone || '1234567890',
          upi_id: editingTrustee.upi_id || 'payalfoundation@ybl',
          upi_qr_url: editingTrustee.upi_qr_url || null,
          order: Number(editingTrustee.order) || localTrustees.length + 1
        };
        const created = await createTrustee(token, payload);
        updatedList = [...localTrustees, created];
      } else {
        const payload = {
          name: editingTrustee.name,
          role: editingTrustee.role,
          role_mr: editingTrustee.role_mr,
          photo_url: editingTrustee.photo_url,
          phone: editingTrustee.phone || '1234567890',
          upi_id: editingTrustee.upi_id || 'payalfoundation@ybl',
          upi_qr_url: editingTrustee.upi_qr_url || null,
          order: Number(editingTrustee.order) || 0
        };
        const saved = await updateTrustee(token, editingTrustee.id, payload);
        updatedList = localTrustees.map(item => item.id === editingTrustee.id ? (saved || { ...item, ...payload }) : item);
      }
      setLocalTrustees(updatedList);
      if (onUpdateTrustees) onUpdateTrustees(updatedList);
      localStorage.setItem('payal_trustees', JSON.stringify(updatedList));
      setEditingTrustee(null);
      setTrusteeMsg({ type: 'success', text: 'विश्वस्त माहिती यशस्वीरीत्या सेव्ह झाली! (Trustee saved successfully!)' });
      setTimeout(() => setTrusteeMsg({ type: '', text: '' }), 4000);
    } catch (err) {
      console.error(err);
      setTrusteeMsg({ type: 'error', text: 'विश्वस्त सेव्ह करताना अडचण आली.' });
    } finally {
      setTrusteeSaving(false);
    }
  };

  const handleDeleteTrustee = async (id) => {
    if (!window.confirm('हा विश्वस्त खरोखर हटवायचा आहे का? (Are you sure you want to delete this trustee?)')) {
      return;
    }
    try {
      await deleteTrustee(token, id);
      const updatedList = localTrustees.filter(item => item.id !== id);
      setLocalTrustees(updatedList);
      if (onUpdateTrustees) onUpdateTrustees(updatedList);
      localStorage.setItem('payal_trustees', JSON.stringify(updatedList));
      setTrusteeMsg({ type: 'success', text: 'विश्वस्त यशस्वीरीत्या हटवला गेला! (Trustee deleted!)' });
      setTimeout(() => setTrusteeMsg({ type: '', text: '' }), 4000);
    } catch (err) {
      console.error(err);
      setTrusteeMsg({ type: 'error', text: 'विश्वस्त हटवताना त्रुटी आली.' });
    }
  };

  // Gallery Handlers
  const handleGalleryPhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setGalleryUploading(true);
    setGalleryMsg({ type: '', text: '' });
    try {
      const url = await uploadInitiativeImage(token, file);
      if (url) {
        setEditingGallery(prev => ({ ...prev, image_url: url }));
        setGalleryMsg({ type: 'success', text: 'छायाचित्र यशस्वीरीत्या अपलोड झाले! (Photo uploaded successfully!)' });
      }
    } catch (err) {
      console.error(err);
      setGalleryMsg({ type: 'error', text: 'छायाचित्र अपलोड करताना त्रुटी आली.' });
    } finally {
      setGalleryUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleSaveGallery = async (e) => {
    e.preventDefault();
    if (!editingGallery.image_url?.trim()) {
      setGalleryMsg({ type: 'error', text: 'कृपया छायाचित्राचा फोटो निवडा किंवा अपलोड करा.' });
      return;
    }
    const finalTitleMr = editingGallery.title_mr?.trim() || editingGallery.title?.trim() || 'सामाजिक कार्य छायाचित्र';
    const finalTitleEn = editingGallery.title?.trim() || editingGallery.title_mr?.trim() || 'Social Work Photo';

    setGallerySaving(true);
    setGalleryMsg({ type: '', text: '' });
    try {
      let updatedList = [];
      const payload = {
        image_url: editingGallery.image_url.trim(),
        title: finalTitleEn,
        title_mr: finalTitleMr,
        category: editingGallery.category?.trim() || 'Social Service',
        category_mr: editingGallery.category_mr?.trim() || 'सामाजिक कार्य',
        order: Number(editingGallery.order) || localGallery.length + 1
      };

      if (editingGallery.id === 'new') {
        const created = await createGalleryItem(token, payload);
        updatedList = [...localGallery, created];
      } else {
        const saved = await updateGalleryItem(token, editingGallery.id, payload);
        updatedList = localGallery.map(item =>
          String(item.id) === String(editingGallery.id) ? (saved || { ...item, ...payload }) : item
        );
      }

      // Sort by order
      updatedList.sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));

      setLocalGallery(updatedList);
      if (onUpdateGallery) onUpdateGallery(updatedList);
      localStorage.setItem('payal_gallery', JSON.stringify(updatedList));
      setEditingGallery(null);
      setGalleryMsg({ type: 'success', text: 'छायाचित्र यशस्वीरीत्या सेव्ह झाले! (Photo saved successfully!)' });
      setTimeout(() => setGalleryMsg({ type: '', text: '' }), 4000);
    } catch (err) {
      console.error(err);
      setGalleryMsg({ type: 'error', text: 'छायाचित्र सेव्ह करताना त्रुटी आली.' });
    } finally {
      setGallerySaving(false);
    }
  };

  const handleDeleteGallery = async (id) => {
    if (!window.confirm('हे छायाचित्र खरोखर हटवायचे आहे का? (Are you sure you want to delete this photo?)')) {
      return;
    }
    try {
      await deleteGalleryItem(token, id);
      const updatedList = localGallery.filter(item => String(item.id) !== String(id));
      setLocalGallery(updatedList);
      if (onUpdateGallery) onUpdateGallery(updatedList);
      localStorage.setItem('payal_gallery', JSON.stringify(updatedList));
      setGalleryMsg({ type: 'success', text: 'छायाचित्र यशस्वीरीत्या हटवले गेले! (Photo deleted!)' });
      setTimeout(() => setGalleryMsg({ type: '', text: '' }), 4000);
    } catch (err) {
      console.error(err);
      setGalleryMsg({ type: 'error', text: 'छायाचित्र हटवताना त्रुटी आली.' });
    }
  };

  const handleMoveGallery = (index, direction) => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= localGallery.length) return;
    const reordered = [...localGallery];
    const [movedItem] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, movedItem);
    const updated = reordered.map((item, idx) => ({ ...item, order: idx + 1 }));
    setLocalGallery(updated);
    if (onUpdateGallery) onUpdateGallery(updated);
    localStorage.setItem('payal_gallery', JSON.stringify(updated));
  };

  const handleResetGalleryDefaults = () => {
    if (!window.confirm('सर्व मूळ छायाचित्रे पूर्ववत करायची आहेत का? (Reset gallery to default photos?)')) {
      return;
    }
    setLocalGallery(DEFAULT_GALLERY_FALLBACK);
    if (onUpdateGallery) onUpdateGallery(DEFAULT_GALLERY_FALLBACK);
    localStorage.setItem('payal_gallery', JSON.stringify(DEFAULT_GALLERY_FALLBACK));
    setGalleryMsg({ type: 'success', text: 'सर्व मूळ छायाचित्रे पूर्ववत केली गेली! (Default photos restored!)' });
    setTimeout(() => setGalleryMsg({ type: '', text: '' }), 4000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await adminLogin(password);
      if (res && (res.token || res.success)) {
        const adminToken = res.token || 'admin123';
        setToken(adminToken);
        localStorage.setItem('admin_token', adminToken);
        loadAllAdminData();
      }
    } catch (err) {
      setLoginError('चुकीचा पासवर्ड! कृपया योग्य पासवर्ड प्रविष्ट करा (Default: admin123)');
    }
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('admin_token');
  };

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      const [s, d, v, m, tr, gal] = await Promise.allSettled([
        fetchDashboardStats(),
        fetchAllDonations(),
        fetchAllVolunteers(),
        fetchAllMessages(),
        fetchTrustees(),
        fetchGallery()
      ]);
      if (s.status === 'fulfilled' && s.value) setStats(s.value);
      if (d.status === 'fulfilled' && d.value) setDonations(d.value);
      if (v.status === 'fulfilled' && v.value) setVolunteers(v.value);
      if (m.status === 'fulfilled' && m.value) setMessages(m.value);
      if (tr.status === 'fulfilled' && tr.value && tr.value.length > 0) {
        setLocalTrustees(tr.value);
        if (onUpdateTrustees) onUpdateTrustees(tr.value);
        localStorage.setItem('payal_trustees', JSON.stringify(tr.value));
      }
      if (gal.status === 'fulfilled' && gal.value && gal.value.length > 0) {
        setLocalGallery(gal.value);
        if (onUpdateGallery) onUpdateGallery(gal.value);
        localStorage.setItem('payal_gallery', JSON.stringify(gal.value));
      }
    } catch (err) {
      console.error('Error fetching admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('modal-open');
      window.addEventListener('keydown', handleKeyDown);
      if (token) {
        loadAllAdminData();
      }
    } else {
      document.body.style.overflow = '';
      document.body.classList.remove('modal-open');
    }

    return () => {
      document.body.style.overflow = '';
      document.body.classList.remove('modal-open');
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, token, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.8)',
      backdropFilter: 'blur(8px)',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.25rem'
    }}>
      <div style={{
        backgroundColor: 'var(--light-surface)',
        color: 'var(--text-main)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        maxWidth: '1000px',
        width: '100%',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
        overflow: 'hidden'
      }}>
        
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.75rem',
          background: 'var(--dark-bg)',
          color: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <ShieldCheck size={24} style={{ color: 'var(--accent-saffron)' }} />
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>
                Payal Foundation and Social Service — Admin Dashboard
              </h3>
              <div style={{ fontSize: '0.75rem', opacity: 0.75 }}>
                Real-time management portal for inquiries, donations & volunteers
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              opacity: 0.8,
              transition: 'opacity 0.2s'
            }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        {!token ? (
          /* Login Form */
          <div style={{ padding: '3.5rem 2rem', textAlign: 'center', maxWidth: '420px', margin: '0 auto' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem auto'
            }}>
              <ShieldCheck size={32} />
            </div>
            <h4 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
              Trust Admin Access
            </h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.75rem' }}>
              Enter the admin secret key to view live donations, volunteer applications, and messages.
            </p>

            <form onSubmit={handleLogin}>
              <input
                type="password"
                placeholder="Admin Password (Default: admin123)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1.5px solid var(--border-color)',
                  fontSize: '0.95rem',
                  marginBottom: '1rem'
                }}
                required
              />
              {loginError && (
                <div style={{ color: 'var(--accent-rose)', fontSize: '0.85rem', marginBottom: '1rem', fontWeight: 600 }}>
                  {loginError}
                </div>
              )}
              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }}>
                Login to Portal
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard View */
          <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflow: 'hidden' }}>
            
            {/* Top Stat Ribbon & Tabs */}
            <div style={{
              padding: '1rem 1.75rem',
              backgroundColor: 'var(--light-bg)',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              {/* Tab Switchers */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setActiveTab('homestats')}
                  style={{
                    padding: '0.45rem 1rem',
                    borderRadius: 'var(--radius-full)',
                    border: 'none',
                    background: activeTab === 'homestats' ? 'var(--primary)' : 'rgba(0,0,0,0.05)',
                    color: activeTab === 'homestats' ? '#ffffff' : 'var(--text-main)',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <SlidersHorizontal size={15} />
                  <span>Home Stats (आकडेवारी)</span>
                </button>

                <button
                  onClick={() => { setActiveTab('initiatives'); setEditingInit(null); }}
                  style={{
                    padding: '0.45rem 1rem',
                    borderRadius: 'var(--radius-full)',
                    border: 'none',
                    background: activeTab === 'initiatives' ? 'var(--primary)' : 'rgba(0,0,0,0.05)',
                    color: activeTab === 'initiatives' ? '#ffffff' : 'var(--text-main)',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <Target size={15} />
                  <span>Initiatives (उपक्रम - {localInitiatives.length})</span>
                </button>

                <button
                  onClick={() => { setActiveTab('trustees'); setEditingTrustee(null); }}
                  style={{
                    padding: '0.45rem 1rem',
                    borderRadius: 'var(--radius-full)',
                    border: 'none',
                    background: activeTab === 'trustees' ? 'var(--primary)' : 'rgba(0,0,0,0.05)',
                    color: activeTab === 'trustees' ? '#ffffff' : 'var(--text-main)',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <ShieldCheck size={15} />
                  <span>Trustees (विश्वस्त मंडळ - {localTrustees.length})</span>
                </button>

                <button
                  onClick={() => { setActiveTab('gallery'); setEditingGallery(null); }}
                  style={{
                    padding: '0.45rem 1rem',
                    borderRadius: 'var(--radius-full)',
                    border: 'none',
                    background: activeTab === 'gallery' ? 'var(--primary)' : 'rgba(0,0,0,0.05)',
                    color: activeTab === 'gallery' ? '#ffffff' : 'var(--text-main)',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <Camera size={15} />
                  <span>Gallery (छायाचित्रे - {localGallery.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('donations')}
                  style={{
                    padding: '0.45rem 1rem',
                    borderRadius: 'var(--radius-full)',
                    border: 'none',
                    background: activeTab === 'donations' ? 'var(--primary)' : 'rgba(0,0,0,0.05)',
                    color: activeTab === 'donations' ? '#ffffff' : 'var(--text-main)',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <DollarSign size={15} />
                  <span>Donations ({donations.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('volunteers')}
                  style={{
                    padding: '0.45rem 1rem',
                    borderRadius: 'var(--radius-full)',
                    border: 'none',
                    background: activeTab === 'volunteers' ? 'var(--primary)' : 'rgba(0,0,0,0.05)',
                    color: activeTab === 'volunteers' ? '#ffffff' : 'var(--text-main)',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <Users size={15} />
                  <span>Volunteers ({volunteers.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('messages')}
                  style={{
                    padding: '0.45rem 1rem',
                    borderRadius: 'var(--radius-full)',
                    border: 'none',
                    background: activeTab === 'messages' ? 'var(--primary)' : 'rgba(0,0,0,0.05)',
                    color: activeTab === 'messages' ? '#ffffff' : 'var(--text-main)',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <MessageSquare size={15} />
                  <span>Inquiries ({messages.length})</span>
                </button>
              </div>

              {/* Refresh & Logout */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button
                  onClick={loadAllAdminData}
                  style={{
                    background: '#ffffff',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-full)',
                    padding: '0.35rem 0.75rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    fontSize: '0.8rem',
                    fontWeight: 600
                  }}
                >
                  <RefreshCw size={13} className={loading ? 'spin' : ''} />
                  <span>Refresh</span>
                </button>
                <button
                  onClick={handleLogout}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent-rose)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    fontSize: '0.82rem',
                    fontWeight: 600
                  }}
                >
                  <LogOut size={14} />
                  <span>Logout</span>
                </button>
              </div>
            </div>

            {/* Tab Contents with Scrollable Tables */}
            <div style={{ padding: '1.5rem 1.75rem', overflowY: 'auto', flexGrow: 1 }}>
              {activeTab === 'homestats' && (
                <div>
                  {statsSuccess && (
                    <div style={{
                      backgroundColor: '#dcfce7',
                      border: '1px solid #86efac',
                      color: '#15803d',
                      padding: '0.85rem 1.25rem',
                      borderRadius: 'var(--radius-sm)',
                      marginBottom: '1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontWeight: 600,
                      fontSize: '0.9rem'
                    }}>
                      <CheckCircle size={18} />
                      <span>{statsSuccess}</span>
                    </div>
                  )}

                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div>
                        <h4 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 0.25rem 0', color: 'var(--text-main)' }}>
                          Home Page Impact Numbers (मुख्यपृष्ठ आकडेवारी व्यवस्थापन)
                        </h4>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          मुख्यपृष्ठावरील ३ प्रमुख आकडेवारी (Community Dedicated, Active Social Workers, Families Impacted) येथे बदला. बदल त्वरित मुख्यपृष्ठावर दिसतील.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleResetDefaults}
                        style={{
                          background: '#f1f5f9',
                          border: '1px solid var(--border-color)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '0.4rem 0.85rem',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          color: 'var(--text-muted)'
                        }}
                      >
                        <RotateCcw size={14} />
                        <span>Reset Defaults (मूळ मूल्ये)</span>
                      </button>
                    </div>
                  </div>

                  <form onSubmit={handleSaveHomeStats}>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                      gap: '1.25rem',
                      marginBottom: '1.5rem'
                    }}>
                      {/* Card 1: Community Dedicated */}
                      <div style={{
                        border: '1.5px solid #bfdbfe',
                        borderRadius: 'var(--radius-md)',
                        padding: '1.25rem',
                        backgroundColor: '#f8fafc',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
                          <div style={{
                            background: 'var(--primary-light)',
                            color: 'var(--primary)',
                            width: '36px',
                            height: '36px',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <HandHeart size={20} />
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>Counter 1</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Community Dedicated</div>
                          </div>
                        </div>

                        <div style={{ marginBottom: '0.85rem' }}>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--text-main)' }}>
                            Value / Number (उदा. 100% किंवा 500+)
                          </label>
                          <input
                            type="text"
                            value={statsForm.stat1_number}
                            onChange={(e) => setStatsForm({ ...statsForm, stat1_number: e.target.value })}
                            required
                            style={{
                              width: '100%',
                              padding: '0.6rem 0.85rem',
                              borderRadius: '6px',
                              border: '1px solid var(--border-color)',
                              fontSize: '0.92rem',
                              fontWeight: 700,
                              color: 'var(--primary)'
                            }}
                          />
                        </div>

                        <div style={{ marginBottom: '0.85rem' }}>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.3rem', color: 'var(--text-muted)' }}>
                            Label (English)
                          </label>
                          <input
                            type="text"
                            value={statsForm.stat1_label}
                            onChange={(e) => setStatsForm({ ...statsForm, stat1_label: e.target.value })}
                            required
                            style={{
                              width: '100%',
                              padding: '0.55rem 0.85rem',
                              borderRadius: '6px',
                              border: '1px solid var(--border-color)',
                              fontSize: '0.88rem'
                            }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.3rem', color: 'var(--text-muted)' }}>
                            Label (मराठी)
                          </label>
                          <input
                            type="text"
                            value={statsForm.stat1_label_mr}
                            onChange={(e) => setStatsForm({ ...statsForm, stat1_label_mr: e.target.value })}
                            required
                            style={{
                              width: '100%',
                              padding: '0.55rem 0.85rem',
                              borderRadius: '6px',
                              border: '1px solid var(--border-color)',
                              fontSize: '0.88rem'
                            }}
                          />
                        </div>
                      </div>

                      {/* Card 2: Active Social Workers */}
                      <div style={{
                        border: '1.5px solid #fed7aa',
                        borderRadius: 'var(--radius-md)',
                        padding: '1.25rem',
                        backgroundColor: '#f8fafc',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
                          <div style={{
                            background: '#fef3c7',
                            color: '#b45309',
                            width: '36px',
                            height: '36px',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <Users size={20} />
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>Counter 2</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Active Social Workers</div>
                          </div>
                        </div>

                        <div style={{ marginBottom: '0.85rem' }}>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--text-main)' }}>
                            Value / Number (उदा. 50+ किंवा 100+)
                          </label>
                          <input
                            type="text"
                            value={statsForm.stat2_number}
                            onChange={(e) => setStatsForm({ ...statsForm, stat2_number: e.target.value })}
                            required
                            style={{
                              width: '100%',
                              padding: '0.6rem 0.85rem',
                              borderRadius: '6px',
                              border: '1px solid var(--border-color)',
                              fontSize: '0.92rem',
                              fontWeight: 700,
                              color: '#b45309'
                            }}
                          />
                        </div>

                        <div style={{ marginBottom: '0.85rem' }}>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.3rem', color: 'var(--text-muted)' }}>
                            Label (English)
                          </label>
                          <input
                            type="text"
                            value={statsForm.stat2_label}
                            onChange={(e) => setStatsForm({ ...statsForm, stat2_label: e.target.value })}
                            required
                            style={{
                              width: '100%',
                              padding: '0.55rem 0.85rem',
                              borderRadius: '6px',
                              border: '1px solid var(--border-color)',
                              fontSize: '0.88rem'
                            }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.3rem', color: 'var(--text-muted)' }}>
                            Label (मराठी)
                          </label>
                          <input
                            type="text"
                            value={statsForm.stat2_label_mr}
                            onChange={(e) => setStatsForm({ ...statsForm, stat2_label_mr: e.target.value })}
                            required
                            style={{
                              width: '100%',
                              padding: '0.55rem 0.85rem',
                              borderRadius: '6px',
                              border: '1px solid var(--border-color)',
                              fontSize: '0.88rem'
                            }}
                          />
                        </div>
                      </div>

                      {/* Card 3: Families Impacted */}
                      <div style={{
                        border: '1.5px solid #bbf7d0',
                        borderRadius: 'var(--radius-md)',
                        padding: '1.25rem',
                        backgroundColor: '#f8fafc',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
                          <div style={{
                            background: '#dcfce7',
                            color: '#15803d',
                            width: '36px',
                            height: '36px',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <Heart size={20} />
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>Counter 3</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Families Impacted</div>
                          </div>
                        </div>

                        <div style={{ marginBottom: '0.85rem' }}>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--text-main)' }}>
                            Value / Number (उदा. 10,000+ किंवा 25,000+)
                          </label>
                          <input
                            type="text"
                            value={statsForm.stat3_number}
                            onChange={(e) => setStatsForm({ ...statsForm, stat3_number: e.target.value })}
                            required
                            style={{
                              width: '100%',
                              padding: '0.6rem 0.85rem',
                              borderRadius: '6px',
                              border: '1px solid var(--border-color)',
                              fontSize: '0.92rem',
                              fontWeight: 700,
                              color: '#15803d'
                            }}
                          />
                        </div>

                        <div style={{ marginBottom: '0.85rem' }}>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.3rem', color: 'var(--text-muted)' }}>
                            Label (English)
                          </label>
                          <input
                            type="text"
                            value={statsForm.stat3_label}
                            onChange={(e) => setStatsForm({ ...statsForm, stat3_label: e.target.value })}
                            required
                            style={{
                              width: '100%',
                              padding: '0.55rem 0.85rem',
                              borderRadius: '6px',
                              border: '1px solid var(--border-color)',
                              fontSize: '0.88rem'
                            }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.3rem', color: 'var(--text-muted)' }}>
                            Label (मराठी)
                          </label>
                          <input
                            type="text"
                            value={statsForm.stat3_label_mr}
                            onChange={(e) => setStatsForm({ ...statsForm, stat3_label_mr: e.target.value })}
                            required
                            style={{
                              width: '100%',
                              padding: '0.55rem 0.85rem',
                              borderRadius: '6px',
                              border: '1px solid var(--border-color)',
                              fontSize: '0.88rem'
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Live Preview Box */}
                    <div style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1.25rem',
                      marginBottom: '1.5rem'
                    }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                        Live Preview on Homepage (मुख्यपृष्ठावर कसे दिसेल):
                      </div>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '1rem'
                      }}>
                        <div style={{ padding: '0.85rem 1rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <HandHeart size={20} />
                          </div>
                          <div>
                            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1.1 }}>{statsForm.stat1_number || '—'}</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>{statsForm.stat1_label_mr} / {statsForm.stat1_label}</div>
                          </div>
                        </div>

                        <div style={{ padding: '0.85rem 1rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ background: '#fef3c7', color: '#b45309', width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Users size={20} />
                          </div>
                          <div>
                            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#b45309', lineHeight: 1.1 }}>{statsForm.stat2_number || '—'}</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>{statsForm.stat2_label_mr} / {statsForm.stat2_label}</div>
                          </div>
                        </div>

                        <div style={{ padding: '0.85rem 1rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ background: '#dcfce7', color: '#15803d', width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Heart size={20} />
                          </div>
                          <div>
                            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#15803d', lineHeight: 1.1 }}>{statsForm.stat3_number || '—'}</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>{statsForm.stat3_label_mr} / {statsForm.stat3_label}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', alignItems: 'center' }}>
                      <button
                        type="submit"
                        disabled={statsSaving}
                        className="btn btn-primary"
                        style={{
                          padding: '0.75rem 1.75rem',
                          fontSize: '0.95rem',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          cursor: statsSaving ? 'not-allowed' : 'pointer',
                          boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
                        }}
                      >
                        <Save size={18} />
                        <span>{statsSaving ? 'Saving...' : 'Save & Update Homepage (बदल सेव्ह करा)'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {activeTab === 'initiatives' && (
                <div>
                  {initMsg.text && (
                    <div style={{
                      backgroundColor: initMsg.type === 'error' ? '#fee2e2' : '#dcfce7',
                      border: `1px solid ${initMsg.type === 'error' ? '#fca5a5' : '#86efac'}`,
                      color: initMsg.type === 'error' ? '#b91c1c' : '#15803d',
                      padding: '0.85rem 1.25rem',
                      borderRadius: 'var(--radius-sm)',
                      marginBottom: '1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontWeight: 600,
                      fontSize: '0.9rem'
                    }}>
                      {initMsg.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
                      <span>{initMsg.text}</span>
                    </div>
                  )}

                  {editingInit ? (
                    /* Edit / Add Initiative Form */
                    <div style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <button
                            type="button"
                            onClick={() => setEditingInit(null)}
                            style={{
                              background: '#f1f5f9',
                              border: 'none',
                              borderRadius: 'var(--radius-full)',
                              width: '32px',
                              height: '32px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              color: 'var(--text-main)'
                            }}
                          >
                            <ArrowLeft size={16} />
                          </button>
                          <h4 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
                            {editingInit.id === 'new' ? 'नवीन उपक्रम जोडा (Add New Initiative)' : `उपक्रम संपादित करा: ${editingInit.title_mr || editingInit.title}`}
                          </h4>
                        </div>
                        <button
                          type="button"
                          onClick={() => setEditingInit(null)}
                          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem' }}
                        >
                          रद्द करा (Cancel)
                        </button>
                      </div>

                      <form onSubmit={handleSaveInitiative}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                          
                          {/* Left Column: Text & Details */}
                          <div>
                            <div style={{ marginBottom: '1rem' }}>
                              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                                Initiative Title (English) *
                              </label>
                              <input
                                type="text"
                                value={editingInit.title}
                                onChange={(e) => setEditingInit({ ...editingInit, title: e.target.value })}
                                placeholder="e.g. Community Food & Ration Distribution"
                                required
                                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.9rem' }}
                              />
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                                उपक्रमाचे नाव (मराठी)
                              </label>
                              <input
                                type="text"
                                value={editingInit.title_mr || ''}
                                onChange={(e) => setEditingInit({ ...editingInit, title_mr: e.target.value })}
                                placeholder="उदा. अन्नदान व अन्नधान्य वाटप मोहीम"
                                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.9rem' }}
                              />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                              <div>
                                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                                  Category (श्रेणी)
                                </label>
                                <input
                                  type="text"
                                  value={editingInit.category || ''}
                                  onChange={(e) => setEditingInit({ ...editingInit, category: e.target.value })}
                                  placeholder="e.g. Hunger Relief, Healthcare"
                                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.9rem' }}
                                />
                              </div>
                              <div>
                                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                                  Target Amount (₹ लक्ष)
                                </label>
                                <input
                                  type="number"
                                  value={editingInit.target_amount || ''}
                                  onChange={(e) => setEditingInit({ ...editingInit, target_amount: e.target.value })}
                                  placeholder="200000"
                                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.9rem' }}
                                />
                              </div>
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                                Raised Amount (₹ जमा झालेला निधी)
                              </label>
                              <input
                                type="number"
                                value={editingInit.raised_amount || ''}
                                onChange={(e) => setEditingInit({ ...editingInit, raised_amount: e.target.value })}
                                placeholder="140000"
                                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.9rem' }}
                              />
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                                Description (English)
                              </label>
                              <textarea
                                rows={3}
                                value={editingInit.description || ''}
                                onChange={(e) => setEditingInit({ ...editingInit, description: e.target.value })}
                                placeholder="Providing nutritious meals and monthly ration kits..."
                                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.88rem', resize: 'vertical' }}
                              />
                            </div>

                            <div>
                              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                                वर्णन (मराठी)
                              </label>
                              <textarea
                                rows={3}
                                value={editingInit.description_mr || ''}
                                onChange={(e) => setEditingInit({ ...editingInit, description_mr: e.target.value })}
                                placeholder="गरीब व गरजू कुटुंबांना दरमहा पोषण आहार व रेशन किट वाटप करणे..."
                                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.88rem', resize: 'vertical' }}
                              />
                            </div>
                          </div>

                          {/* Right Column: Image Selection & Upload */}
                          <div>
                            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                              🖼️ उपक्रमाचा फोटो (Initiative Image)
                            </label>
                            
                            {/* Live Image Preview Card */}
                            <div style={{
                              width: '100%',
                              height: '200px',
                              borderRadius: '10px',
                              overflow: 'hidden',
                              backgroundColor: '#f1f5f9',
                              border: '2px dashed var(--border-color)',
                              position: 'relative',
                              marginBottom: '1rem',
                              boxShadow: '0 4px 6px rgba(0,0,0,0.06)'
                            }}>
                              <img
                                src={editingInit.image_url || '/food_distribution.jpg'}
                                alt="Preview"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={(e) => { e.target.src = '/food_distribution.jpg'; }}
                              />
                              <div style={{
                                position: 'absolute',
                                bottom: '8px',
                                right: '8px',
                                background: 'rgba(0,0,0,0.7)',
                                color: '#ffffff',
                                padding: '0.2rem 0.6rem',
                                borderRadius: '4px',
                                fontSize: '0.72rem',
                                fontWeight: 600
                              }}>
                                Current Image Preview
                              </div>
                            </div>

                            {/* Hidden file input */}
                            <input
                              type="file"
                              ref={fileInputRef}
                              accept="image/*"
                              onChange={handleImageUpload}
                              style={{ display: 'none' }}
                            />

                            {/* Upload Button */}
                            <div style={{ marginBottom: '1.25rem' }}>
                              <button
                                type="button"
                                disabled={initUploading}
                                onClick={() => fileInputRef.current?.click()}
                                style={{
                                  width: '100%',
                                  padding: '0.65rem 1rem',
                                  borderRadius: '6px',
                                  border: '1.5px solid var(--primary)',
                                  background: 'var(--primary-light)',
                                  color: 'var(--primary)',
                                  fontWeight: 700,
                                  fontSize: '0.88rem',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '0.5rem',
                                  cursor: initUploading ? 'not-allowed' : 'pointer'
                                }}
                              >
                                <Upload size={16} />
                                <span>{initUploading ? 'फोटो अपलोड होत आहे...' : '📁 डिव्हाइसवरून नवीन फोटो निवडा (Upload Image)'}</span>
                              </button>
                            </div>

                            {/* Preset Images Gallery */}
                            <div style={{ marginBottom: '1.25rem' }}>
                              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                                किंवा खालील उपलब्ध फोटोंमधून निवडा (Choose Preset):
                              </div>
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                                {PRESET_IMAGES.map((p, idx) => {
                                  const isSelected = editingInit.image_url === p.path;
                                  return (
                                    <div
                                      key={idx}
                                      onClick={() => setEditingInit({ ...editingInit, image_url: p.path })}
                                      title={p.label}
                                      style={{
                                        cursor: 'pointer',
                                        borderRadius: '6px',
                                        overflow: 'hidden',
                                        height: '56px',
                                        border: isSelected ? '2.5px solid var(--primary)' : '1px solid var(--border-color)',
                                        opacity: isSelected ? 1 : 0.75,
                                        transform: isSelected ? 'scale(1.04)' : 'none',
                                        transition: 'all 0.15s ease',
                                        boxShadow: isSelected ? '0 0 0 2px var(--primary-light)' : 'none'
                                      }}
                                    >
                                      <img src={p.path} alt={p.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Direct URL input */}
                            <div>
                              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                                Image Path / URL:
                              </div>
                              <input
                                type="text"
                                value={editingInit.image_url || ''}
                                onChange={(e) => setEditingInit({ ...editingInit, image_url: e.target.value })}
                                placeholder="/food_distribution.jpg"
                                style={{ width: '100%', padding: '0.55rem 0.85rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.85rem', fontFamily: 'monospace' }}
                              />
                            </div>

                          </div>
                        </div>

                        {/* Save / Cancel buttons */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.85rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                          <button
                            type="button"
                            onClick={() => setEditingInit(null)}
                            style={{
                              padding: '0.65rem 1.25rem',
                              borderRadius: '6px',
                              border: '1px solid var(--border-color)',
                              background: '#f8fafc',
                              color: 'var(--text-main)',
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                          >
                            रद्द करा (Cancel)
                          </button>
                          <button
                            type="submit"
                            disabled={initSaving}
                            className="btn btn-primary"
                            style={{
                              padding: '0.65rem 1.5rem',
                              fontWeight: 700,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.45rem',
                              cursor: initSaving ? 'not-allowed' : 'pointer'
                            }}
                          >
                            <Save size={16} />
                            <span>{initSaving ? 'सेव्ह होत आहे...' : 'उपक्रम सेव्ह करा (Save Changes)'}</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    /* Initiatives List View */
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                        <div>
                          <h4 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 0.25rem 0', color: 'var(--text-main)' }}>
                            Initiatives & Projects Management (उपक्रम व्यवस्थापन)
                          </h4>
                          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            येथून तुम्ही उपक्रमांची नावे, माहिती, निधीचे आकडे आणि फोटो सहज बदलू शकता.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handleAddNewInitiative}
                          className="btn btn-primary"
                          style={{
                            padding: '0.55rem 1.15rem',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem'
                          }}
                        >
                          <Plus size={16} />
                          <span>नवीन उपक्रम जोडा (Add Initiative)</span>
                        </button>
                      </div>

                      {localInitiatives.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                          कोणताही उपक्रम आढळला नाही. नवीन उपक्रम जोडण्यासाठी वरील बटणावर क्लिक करा.
                        </div>
                      ) : (
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                          gap: '1.25rem'
                        }}>
                          {localInitiatives.map((item) => (
                            <div
                              key={item.id}
                              style={{
                                border: '1px solid var(--border-color)',
                                borderRadius: 'var(--radius-md)',
                                overflow: 'hidden',
                                backgroundColor: '#ffffff',
                                display: 'flex',
                                flexDirection: 'column',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
                                transition: 'transform 0.2s, box-shadow 0.2s'
                              }}
                            >
                              {/* Card Image */}
                              <div style={{ height: '140px', position: 'relative', backgroundColor: '#f1f5f9' }}>
                                <img
                                  src={item.image_url || '/food_distribution.jpg'}
                                  alt={item.title}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                  onError={(e) => { e.target.src = '/food_distribution.jpg'; }}
                                />
                                <div style={{
                                  position: 'absolute',
                                  top: '8px',
                                  left: '8px',
                                  background: 'rgba(255,255,255,0.95)',
                                  color: 'var(--primary)',
                                  padding: '0.2rem 0.6rem',
                                  borderRadius: '9999px',
                                  fontSize: '0.72rem',
                                  fontWeight: 700
                                }}>
                                  {item.category}
                                </div>
                              </div>

                              {/* Card Info */}
                              <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                <div style={{ fontWeight: 800, fontSize: '0.98rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                                  {item.title_mr || item.title}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.65rem' }}>
                                  {item.title}
                                </div>

                                <div style={{
                                  background: '#f8fafc',
                                  padding: '0.6rem 0.85rem',
                                  borderRadius: '6px',
                                  fontSize: '0.8rem',
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  marginBottom: '0.85rem'
                                }}>
                                  <span>गोळा: <strong style={{ color: 'var(--primary)' }}>₹{item.raised_amount?.toLocaleString('en-IN') || 0}</strong></span>
                                  <span>लक्ष्य: <strong>₹{item.target_amount?.toLocaleString('en-IN') || 0}</strong></span>
                                </div>

                                {/* Buttons */}
                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                                  <button
                                    type="button"
                                    onClick={() => handleEditInitiative(item)}
                                    style={{
                                      flex: 1,
                                      padding: '0.5rem 0.75rem',
                                      borderRadius: '6px',
                                      border: '1px solid var(--primary)',
                                      background: 'var(--primary-light)',
                                      color: 'var(--primary)',
                                      fontWeight: 700,
                                      fontSize: '0.82rem',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      gap: '0.35rem',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    <Edit3 size={14} />
                                    <span>माहिती व फोटो बदला (Edit)</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteInitiative(item.id)}
                                    style={{
                                      padding: '0.5rem 0.75rem',
                                      borderRadius: '6px',
                                      border: '1px solid #fecaca',
                                      background: '#fee2e2',
                                      color: '#b91c1c',
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center'
                                    }}
                                    title="उपक्रम हटवा (Delete)"
                                  >
                                    <Trash2 size={15} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'trustees' && (
                <div>
                  {trusteeMsg.text && (
                    <div style={{
                      backgroundColor: trusteeMsg.type === 'error' ? '#fee2e2' : '#dcfce7',
                      border: `1px solid ${trusteeMsg.type === 'error' ? '#fca5a5' : '#86efac'}`,
                      color: trusteeMsg.type === 'error' ? '#b91c1c' : '#15803d',
                      padding: '0.85rem 1.25rem',
                      borderRadius: 'var(--radius-sm)',
                      marginBottom: '1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontWeight: 600,
                      fontSize: '0.9rem'
                    }}>
                      {trusteeMsg.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
                      <span>{trusteeMsg.text}</span>
                    </div>
                  )}

                  {editingTrustee ? (
                    /* Edit / Add Trustee Form */
                    <div style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <button
                            type="button"
                            onClick={() => setEditingTrustee(null)}
                            style={{
                              background: '#f1f5f9',
                              border: 'none',
                              borderRadius: 'var(--radius-full)',
                              width: '32px',
                              height: '32px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              color: 'var(--text-main)'
                            }}
                          >
                            <ArrowLeft size={16} />
                          </button>
                          <h4 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
                            {editingTrustee.id === 'new' ? 'नवीन विश्वस्त जोडा (Add New Trustee)' : `विश्वस्त माहिती संपादित करा: ${editingTrustee.name}`}
                          </h4>
                        </div>
                        <button
                          type="button"
                          onClick={() => setEditingTrustee(null)}
                          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem' }}
                        >
                          रद्द करा (Cancel)
                        </button>
                      </div>

                      <form onSubmit={handleSaveTrustee}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                          
                          {/* Left Column: Trustee Details */}
                          <div>
                            <div style={{ marginBottom: '1rem' }}>
                              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                                विश्वस्ताचे नाव (Full Name) *
                              </label>
                              <input
                                type="text"
                                value={editingTrustee.name}
                                onChange={(e) => setEditingTrustee({ ...editingTrustee, name: e.target.value })}
                                placeholder="उदा. Sonya Oghe किंवा Zakir Hussain"
                                required
                                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.9rem' }}
                              />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                              <div>
                                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                                  Role / Designation (English) *
                                </label>
                                <input
                                  type="text"
                                  value={editingTrustee.role}
                                  onChange={(e) => setEditingTrustee({ ...editingTrustee, role: e.target.value })}
                                  placeholder="President / Secretary / Trustee"
                                  required
                                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.9rem' }}
                                />
                              </div>
                              <div>
                                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                                  पद / हुद्दा (मराठी)
                                </label>
                                <input
                                  type="text"
                                  value={editingTrustee.role_mr || ''}
                                  onChange={(e) => setEditingTrustee({ ...editingTrustee, role_mr: e.target.value })}
                                  placeholder="अध्यक्ष / सचिव / विश्वस्त सदस्य"
                                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.9rem' }}
                                />
                              </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                              <div>
                                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                                  मोबाईल नंबर (Mobile Number) *
                                </label>
                                <input
                                  type="text"
                                  value={editingTrustee.phone || '1234567890'}
                                  onChange={(e) => setEditingTrustee({ ...editingTrustee, phone: e.target.value })}
                                  placeholder="1234567890"
                                  required
                                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.9rem' }}
                                />
                              </div>
                              <div>
                                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                                  क्रमवारी (Order / Sequence)
                                </label>
                                <input
                                  type="number"
                                  value={editingTrustee.order || 0}
                                  onChange={(e) => setEditingTrustee({ ...editingTrustee, order: Number(e.target.value) })}
                                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.9rem' }}
                                />
                              </div>
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                                UPI ID (स्कॅनरसाठी)
                              </label>
                              <input
                                type="text"
                                value={editingTrustee.upi_id || 'payalfoundation@ybl'}
                                onChange={(e) => setEditingTrustee({ ...editingTrustee, upi_id: e.target.value })}
                                placeholder="payalfoundation@ybl"
                                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.9rem' }}
                              />
                            </div>
                          </div>

                          {/* Right Column: Photo & Scanner Preview */}
                          <div>
                            {/* Photo Upload & Preview */}
                            <div style={{ marginBottom: '1.25rem' }}>
                              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.45rem' }}>
                                विश्वस्त फोटो / लोगो (Profile Photo or Logo)
                              </label>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                                <div style={{
                                  width: '74px',
                                  height: '74px',
                                  borderRadius: '50%',
                                  overflow: 'hidden',
                                  border: '2.5px solid var(--primary)',
                                  backgroundColor: '#f1f5f9',
                                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                                }}>
                                  <img
                                    src={editingTrustee.photo_url || '/sonya.jpg'}
                                    alt="Trustee Preview"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    onError={(e) => { e.target.src = '/sonya.jpg'; }}
                                  />
                                </div>
                                <div style={{ flex: 1 }}>
                                  <input
                                    type="file"
                                    ref={trusteePhotoRef}
                                    accept="image/*"
                                    onChange={handleTrusteePhotoUpload}
                                    style={{ display: 'none' }}
                                  />
                                  <button
                                    type="button"
                                    disabled={trusteeUploading}
                                    onClick={() => trusteePhotoRef.current?.click()}
                                    style={{
                                      width: '100%',
                                      padding: '0.55rem 0.85rem',
                                      borderRadius: '6px',
                                      border: '1.5px solid var(--primary)',
                                      background: 'var(--primary-light)',
                                      color: 'var(--primary)',
                                      fontWeight: 700,
                                      fontSize: '0.82rem',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      gap: '0.4rem',
                                      cursor: trusteeUploading ? 'not-allowed' : 'pointer',
                                      marginBottom: '0.4rem'
                                    }}
                                  >
                                    <Upload size={14} />
                                    <span>{trusteeUploading ? 'अपलोड होत आहे...' : 'फोटो निवडा (Upload Photo)'}</span>
                                  </button>
                                  <input
                                    type="text"
                                    value={editingTrustee.photo_url || ''}
                                    onChange={(e) => setEditingTrustee({ ...editingTrustee, photo_url: e.target.value })}
                                    placeholder="/sonya.jpg"
                                    style={{ width: '100%', padding: '0.45rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.8rem', fontFamily: 'monospace' }}
                                  />
                                </div>
                              </div>

                              {/* Presets */}
                              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                {PRESET_TRUSTEE_PHOTOS.map((p, idx) => (
                                  <button
                                    type="button"
                                    key={idx}
                                    onClick={() => setEditingTrustee({ ...editingTrustee, photo_url: p.path })}
                                    style={{
                                      fontSize: '0.75rem',
                                      padding: '0.25rem 0.55rem',
                                      borderRadius: '9999px',
                                      border: editingTrustee.photo_url === p.path ? '1.5px solid var(--primary)' : '1px solid var(--border-color)',
                                      background: editingTrustee.photo_url === p.path ? 'var(--primary-light)' : '#f8fafc',
                                      color: editingTrustee.photo_url === p.path ? 'var(--primary)' : 'var(--text-main)',
                                      cursor: 'pointer',
                                      fontWeight: 600
                                    }}
                                  >
                                    {p.label}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* UPI Scanner Preview & Custom QR */}
                            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.45rem' }}>
                                UPI स्कॅनर प्रिव्ह्यू (Live Scanner Preview)
                              </label>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{
                                  width: '100px',
                                  height: '100px',
                                  padding: '6px',
                                  background: '#ffffff',
                                  border: '1.5px solid #cbd5e1',
                                  borderRadius: '10px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                                }}>
                                  {trusteePreviewQr ? (
                                    <img src={trusteePreviewQr} alt="QR Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                  ) : (
                                    <QrCode size={32} color="#94a3b8" />
                                  )}
                                </div>
                                <div style={{ flex: 1 }}>
                                  <input
                                    type="file"
                                    ref={trusteeQrRef}
                                    accept="image/*"
                                    onChange={handleTrusteeQrUpload}
                                    style={{ display: 'none' }}
                                  />
                                  <button
                                    type="button"
                                    disabled={trusteeQrUploading}
                                    onClick={() => trusteeQrRef.current?.click()}
                                    style={{
                                      width: '100%',
                                      padding: '0.45rem 0.75rem',
                                      borderRadius: '6px',
                                      border: '1px solid var(--border-color)',
                                      background: '#f8fafc',
                                      color: 'var(--text-main)',
                                      fontWeight: 600,
                                      fontSize: '0.78rem',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      gap: '0.4rem',
                                      cursor: trusteeQrUploading ? 'not-allowed' : 'pointer',
                                      marginBottom: '0.35rem'
                                    }}
                                  >
                                    <QrCode size={13} />
                                    <span>{trusteeQrUploading ? 'अपलोड होत आहे...' : 'स्वतःचा QR फोटो अपलोड करा'}</span>
                                  </button>
                                  {editingTrustee.upi_qr_url && (
                                    <button
                                      type="button"
                                      onClick={() => setEditingTrustee({ ...editingTrustee, upi_qr_url: null })}
                                      style={{
                                        background: 'none',
                                        border: 'none',
                                        color: 'var(--accent-rose)',
                                        fontSize: '0.75rem',
                                        cursor: 'pointer',
                                        padding: 0
                                      }}
                                    >
                                      मूळ डायनॅमिक QR वर परत या (Use Default)
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>

                          </div>
                        </div>

                        {/* Save / Cancel buttons */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.85rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                          <button
                            type="button"
                            onClick={() => setEditingTrustee(null)}
                            style={{
                              padding: '0.65rem 1.25rem',
                              borderRadius: '6px',
                              border: '1px solid var(--border-color)',
                              background: '#f8fafc',
                              color: 'var(--text-main)',
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                          >
                            रद्द करा (Cancel)
                          </button>
                          <button
                            type="submit"
                            disabled={trusteeSaving}
                            className="btn btn-primary"
                            style={{
                              padding: '0.65rem 1.75rem',
                              fontWeight: 700,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              cursor: trusteeSaving ? 'not-allowed' : 'pointer'
                            }}
                          >
                            <Save size={16} />
                            <span>{trusteeSaving ? 'सेव्ह होत आहे...' : 'विश्वस्त सेव्ह करा (Save Trustee)'}</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    /* Trustees List View */
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                        <div>
                          <h4 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 0.25rem 0', color: 'var(--text-main)' }}>
                            विश्वस्त मंडळ व्यवस्थापन (Trustees Management)
                          </h4>
                          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            प्रत्येक कार्डमधील नाव, पद, मोबाईल नंबर (उदा. 1234567890), फोटो आणि UPI स्कॅनर येथे बदला किंवा नवीन जोडा.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingTrustee({
                              id: 'new',
                              name: '',
                              role: 'Trust Member',
                              role_mr: 'विश्वस्त सदस्य (Trust Member)',
                              photo_url: '/sonya.jpg',
                              phone: '1234567890',
                              upi_id: 'payalfoundation@ybl',
                              upi_qr_url: '',
                              order: localTrustees.length + 1
                            });
                          }}
                          className="btn btn-primary"
                          style={{
                            padding: '0.55rem 1.25rem',
                            fontSize: '0.88rem',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.45rem'
                          }}
                        >
                          <Plus size={16} />
                          <span>नवीन विश्वस्त जोडा (Add Trustee)</span>
                        </button>
                      </div>

                      {localTrustees.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                          कोणताही विश्वस्त आढळला नाही. नवीन विश्वस्त जोडण्यासाठी वरील बटणावर क्लिक करा.
                        </div>
                      ) : (
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                          gap: '1.25rem'
                        }}>
                          {localTrustees.map((item, idx) => (
                            <div
                              key={item.id || idx}
                              style={{
                                border: '1px solid var(--border-color)',
                                borderRadius: 'var(--radius-md)',
                                overflow: 'hidden',
                                backgroundColor: '#ffffff',
                                display: 'flex',
                                flexDirection: 'column',
                                boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                                padding: '1.25rem'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                <div style={{
                                  width: '64px',
                                  height: '64px',
                                  borderRadius: '50%',
                                  overflow: 'hidden',
                                  border: '2.5px solid var(--primary)',
                                  backgroundColor: '#f1f5f9',
                                  flexShrink: 0
                                }}>
                                  <img
                                    src={item.photo_url || '/sonya.jpg'}
                                    alt={item.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    onError={(e) => { e.target.src = '/sonya.jpg'; }}
                                  />
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                                    <h5 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                      {item.name}
                                    </h5>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>#{item.order || idx + 1}</span>
                                  </div>
                                  <div style={{
                                    display: 'inline-block',
                                    background: '#e0f2fe',
                                    color: '#0284c7',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    padding: '0.15rem 0.6rem',
                                    borderRadius: '9999px',
                                    marginBottom: '0.35rem'
                                  }}>
                                    {item.role_mr || item.role}
                                  </div>
                                </div>
                              </div>

                              {/* Phone & UPI Preview Pills */}
                              <div style={{
                                background: '#f8fafc',
                                borderRadius: '8px',
                                padding: '0.75rem',
                                marginBottom: '1rem',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.4rem',
                                fontSize: '0.82rem'
                              }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <Phone size={14} color="var(--primary)" />
                                  <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{item.phone || '1234567890'}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <QrCode size={14} color="#059669" />
                                  <span style={{ fontFamily: 'monospace', color: 'var(--text-muted)', fontSize: '0.78rem' }}>{item.upi_id || 'payalfoundation@ybl'}</span>
                                </div>
                              </div>

                              {/* Card Action Buttons */}
                              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem', marginTop: 'auto' }}>
                                <button
                                  type="button"
                                  onClick={() => setEditingTrustee({ ...item })}
                                  className="btn btn-outline"
                                  style={{
                                    padding: '0.45rem 0.95rem',
                                    fontSize: '0.82rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.35rem'
                                  }}
                                >
                                  <Edit3 size={14} />
                                  <span>संपादित करा (Edit)</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteTrustee(item.id)}
                                  style={{
                                    padding: '0.45rem 0.75rem',
                                    borderRadius: '6px',
                                    border: '1px solid #fecaca',
                                    background: '#fee2e2',
                                    color: '#b91c1c',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}
                                  title="विश्वस्त हटवा (Delete)"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'gallery' && (
                <div>
                  {galleryMsg.text && (
                    <div style={{
                      backgroundColor: galleryMsg.type === 'error' ? '#fee2e2' : '#dcfce7',
                      border: `1px solid ${galleryMsg.type === 'error' ? '#fca5a5' : '#86efac'}`,
                      color: galleryMsg.type === 'error' ? '#b91c1c' : '#15803d',
                      padding: '0.85rem 1.25rem',
                      borderRadius: 'var(--radius-sm)',
                      marginBottom: '1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontWeight: 600,
                      fontSize: '0.9rem'
                    }}>
                      {galleryMsg.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
                      <span>{galleryMsg.text}</span>
                    </div>
                  )}

                  {editingGallery ? (
                    /* Edit / Add Gallery Item Form */
                    <div style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <button
                            type="button"
                            onClick={() => setEditingGallery(null)}
                            style={{
                              background: '#f1f5f9',
                              border: 'none',
                              borderRadius: '50%',
                              width: '32px',
                              height: '32px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer'
                            }}
                          >
                            <ArrowLeft size={16} />
                          </button>
                          <h4 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                            {editingGallery.id === 'new' ? 'नवीन छायाचित्र जोडा (Add New Photo)' : 'छायाचित्र माहिती संपादित करा (Edit Photo)'}
                          </h4>
                        </div>
                        <button
                          type="button"
                          onClick={() => setEditingGallery(null)}
                          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem' }}
                        >
                          रद्द करा (Cancel)
                        </button>
                      </div>

                      <form onSubmit={handleSaveGallery}>
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                          gap: '1.5rem',
                          marginBottom: '1.5rem'
                        }}>
                          {/* Left Column: Titles & Categories */}
                          <div>
                            <div style={{ marginBottom: '1rem' }}>
                              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                                शीर्षक मराठी (Title in Marathi) <span style={{ color: 'var(--accent-rose)' }}>*</span>
                              </label>
                              <input
                                type="text"
                                required
                                value={editingGallery.title_mr || ''}
                                onChange={(e) => setEditingGallery({ ...editingGallery, title_mr: e.target.value })}
                                placeholder="उदा. माणुसकीची साथ: गरजू बाबांना उपचारासाठी मदत"
                                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.9rem' }}
                              />
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                                शीर्षक इंग्रजी (Title in English)
                              </label>
                              <input
                                type="text"
                                value={editingGallery.title || ''}
                                onChange={(e) => setEditingGallery({ ...editingGallery, title: e.target.value })}
                                placeholder="e.g. Emergency Medical & Hospital Assistance in Palghar"
                                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.9rem' }}
                              />
                            </div>

                            {/* Quick Category Chips */}
                            <div style={{ marginBottom: '0.85rem' }}>
                              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-main)' }}>
                                श्रेणी निवडा (Quick Select Category):
                              </label>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.65rem' }}>
                                {PRESET_GALLERY_CATEGORIES.map((cat, cIdx) => {
                                  const isSelected = editingGallery.category_mr === cat.mr || editingGallery.category === cat.en;
                                  return (
                                    <button
                                      key={cIdx}
                                      type="button"
                                      onClick={() => setEditingGallery({
                                        ...editingGallery,
                                        category_mr: cat.mr,
                                        category: cat.en
                                      })}
                                      style={{
                                        fontSize: '0.74rem',
                                        padding: '0.25rem 0.6rem',
                                        borderRadius: '9999px',
                                        border: isSelected ? '1.5px solid var(--primary)' : '1px solid var(--border-color)',
                                        background: isSelected ? 'var(--primary-light)' : '#f8fafc',
                                        color: isSelected ? 'var(--primary)' : 'var(--text-main)',
                                        fontWeight: isSelected ? 700 : 500,
                                        cursor: 'pointer'
                                      }}
                                    >
                                      {cat.mr}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                              <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                                  श्रेणी मराठी (Category)
                                </label>
                                <input
                                  type="text"
                                  value={editingGallery.category_mr || ''}
                                  onChange={(e) => setEditingGallery({ ...editingGallery, category_mr: e.target.value })}
                                  placeholder="उदा. आरोग्य व रुग्णसेवा"
                                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.9rem' }}
                                />
                              </div>
                              <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                                  Category English
                                </label>
                                <input
                                  type="text"
                                  value={editingGallery.category || ''}
                                  onChange={(e) => setEditingGallery({ ...editingGallery, category: e.target.value })}
                                  placeholder="Healthcare & Compassion"
                                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.9rem' }}
                                />
                              </div>
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                                अनुक्रमांक (Display Order नंबर)
                              </label>
                              <input
                                type="number"
                                min="1"
                                value={editingGallery.order || ''}
                                onChange={(e) => setEditingGallery({ ...editingGallery, order: e.target.value })}
                                placeholder="1"
                                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.9rem' }}
                              />
                            </div>
                          </div>

                          {/* Right Column: Image Selection & Upload */}
                          <div>
                            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                              🖼️ छायाचित्राचा फोटो (Gallery Photo)
                            </label>

                            {/* Live Image Preview Card */}
                            <div style={{
                              width: '100%',
                              height: '190px',
                              borderRadius: '10px',
                              overflow: 'hidden',
                              backgroundColor: '#0f172a',
                              border: '2px dashed var(--border-color)',
                              position: 'relative',
                              marginBottom: '0.85rem',
                              boxShadow: '0 4px 6px rgba(0,0,0,0.06)'
                            }}>
                              <img
                                src={editingGallery.image_url || '/about_initiative.jpg'}
                                alt="Preview"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={(e) => { e.target.src = '/about_initiative.jpg'; }}
                              />
                              <div style={{
                                position: 'absolute',
                                top: '8px',
                                left: '8px',
                                background: 'rgba(0,0,0,0.75)',
                                color: 'var(--accent-saffron)',
                                padding: '0.2rem 0.6rem',
                                borderRadius: '9999px',
                                fontSize: '0.72rem',
                                fontWeight: 700
                              }}>
                                {editingGallery.category_mr || 'सामाजिक कार्य'}
                              </div>
                              <div style={{
                                position: 'absolute',
                                bottom: '8px',
                                right: '8px',
                                background: 'rgba(0,0,0,0.7)',
                                color: '#ffffff',
                                padding: '0.2rem 0.6rem',
                                borderRadius: '4px',
                                fontSize: '0.72rem',
                                fontWeight: 600
                              }}>
                                Live Preview
                              </div>
                            </div>

                            {/* Hidden file input */}
                            <input
                              type="file"
                              ref={galleryFileRef}
                              accept="image/*"
                              onChange={handleGalleryPhotoUpload}
                              style={{ display: 'none' }}
                            />

                            {/* Upload Button */}
                            <button
                              type="button"
                              onClick={() => galleryFileRef.current?.click()}
                              disabled={galleryUploading}
                              className="btn btn-outline"
                              style={{
                                width: '100%',
                                padding: '0.55rem',
                                fontSize: '0.82rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.4rem',
                                marginBottom: '0.75rem',
                                cursor: galleryUploading ? 'not-allowed' : 'pointer'
                              }}
                            >
                              <Upload size={14} />
                              <span>{galleryUploading ? 'अपलोड होत आहे... (Uploading...)' : 'गॅलरीसाठी स्वतःचा फोटो अपलोड करा (Upload Photo)'}</span>
                            </button>

                            {/* Preset Images Visual Cards */}
                            <div style={{ marginBottom: '0.85rem' }}>
                              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                                किंवा खालीलपैकी तयार फोटो निवडा (Or pick a preset photo):
                              </div>
                              <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                                gap: '0.45rem',
                                maxHeight: '150px',
                                overflowY: 'auto',
                                padding: '0.25rem',
                                border: '1px solid var(--border-color)',
                                borderRadius: '6px'
                              }}>
                                {PRESET_GALLERY_IMAGES.map((preset, pIdx) => {
                                  const isSelected = editingGallery.image_url === preset.path;
                                  return (
                                    <div
                                      key={pIdx}
                                      onClick={() => setEditingGallery({ ...editingGallery, image_url: preset.path })}
                                      style={{
                                        cursor: 'pointer',
                                        borderRadius: '6px',
                                        overflow: 'hidden',
                                        border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                                        background: isSelected ? 'var(--primary-light)' : '#ffffff',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        transition: 'all 0.2s ease'
                                      }}
                                    >
                                      <div style={{ height: '48px', overflow: 'hidden' }}>
                                        <img
                                          src={preset.path}
                                          alt={preset.label}
                                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                      </div>
                                      <div style={{
                                        padding: '0.25rem 0.35rem',
                                        fontSize: '0.7rem',
                                        fontWeight: isSelected ? 700 : 500,
                                        color: isSelected ? 'var(--primary)' : 'var(--text-main)',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                      }}>
                                        {preset.label}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Direct URL input */}
                            <div>
                              <label style={{ display: 'block', fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                                फोटोची थेट URL किंवा पाथ (Image URL):
                              </label>
                              <input
                                type="text"
                                value={editingGallery.image_url || ''}
                                onChange={(e) => setEditingGallery({ ...editingGallery, image_url: e.target.value })}
                                placeholder="/about_initiative.jpg किंवा https://..."
                                style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.82rem' }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Save / Cancel buttons */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.85rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                          <button
                            type="button"
                            onClick={() => setEditingGallery(null)}
                            style={{
                              padding: '0.65rem 1.25rem',
                              borderRadius: '6px',
                              border: '1px solid var(--border-color)',
                              background: '#f8fafc',
                              color: 'var(--text-main)',
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                          >
                            रद्द करा (Cancel)
                          </button>
                          <button
                            type="submit"
                            disabled={gallerySaving}
                            className="btn btn-primary"
                            style={{
                              padding: '0.65rem 1.75rem',
                              fontWeight: 700,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              cursor: gallerySaving ? 'not-allowed' : 'pointer'
                            }}
                          >
                            <Save size={16} />
                            <span>{gallerySaving ? 'सेव्ह होत आहे...' : 'छायाचित्र सेव्ह करा (Save Photo)'}</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    /* Gallery List View */
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <h4 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                              छायाचित्रे / गॅलरी व्यवस्थापन (Photo Gallery Management)
                            </h4>
                            <span style={{
                              background: 'var(--primary-light)',
                              color: 'var(--primary)',
                              padding: '0.15rem 0.55rem',
                              borderRadius: '9999px',
                              fontSize: '0.75rem',
                              fontWeight: 700
                            }}>
                              एकूण {localGallery.length} छायाचित्रे
                            </span>
                          </div>
                          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            वेबसाईटवर दिसणारी सर्व छायाचित्रे, त्यांचे शीर्षक, श्रेणी व फोटो येथे संपादित करा किंवा नवीन जोडा.
                          </p>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <button
                            type="button"
                            onClick={handleResetGalleryDefaults}
                            style={{
                              background: '#f1f5f9',
                              border: '1px solid var(--border-color)',
                              borderRadius: 'var(--radius-sm)',
                              padding: '0.45rem 0.85rem',
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              color: 'var(--text-muted)'
                            }}
                            title="मूळ ४ छायाचित्रे पूर्ववत करा"
                          >
                            <RotateCcw size={14} />
                            <span>मूळ फोटो पूर्ववत करा (Reset)</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setEditingGallery({
                                id: 'new',
                                image_url: '/about_initiative.jpg',
                                title: '',
                                title_mr: '',
                                category: 'Social Service',
                                category_mr: 'सामाजिक कार्य',
                                order: localGallery.length + 1
                              });
                            }}
                            className="btn btn-primary"
                            style={{
                              padding: '0.55rem 1.25rem',
                              fontSize: '0.88rem',
                              fontWeight: 700,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.45rem'
                            }}
                          >
                            <Plus size={16} />
                            <span>नवीन फोटो जोडा (Add Photo)</span>
                          </button>
                        </div>
                      </div>

                      {localGallery.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px dashed var(--border-color)' }}>
                          <Camera size={44} style={{ color: 'var(--text-muted)', marginBottom: '0.75rem', opacity: 0.5 }} />
                          <h5 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                            कोणतेही छायाचित्र आढळले नाही (No Photos in Gallery)
                          </h5>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                            नवीन फोटो जोडण्यासाठी खालील बटणावर क्लिक करा किंवा मूळ फोटो रिसेट करा.
                          </p>
                          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
                            <button
                              type="button"
                              onClick={handleResetGalleryDefaults}
                              className="btn btn-outline"
                              style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                            >
                              मूळ फोटो आणा (Restore Defaults)
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingGallery({
                                  id: 'new',
                                  image_url: '/about_initiative.jpg',
                                  title: '',
                                  title_mr: '',
                                  category: 'Social Service',
                                  category_mr: 'सामाजिक कार्य',
                                  order: 1
                                });
                              }}
                              className="btn btn-primary"
                              style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                            >
                              नवीन फोटो जोडा (Add Photo)
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                          gap: '1.25rem'
                        }}>
                          {localGallery.map((item, idx) => (
                            <div
                              key={item.id || idx}
                              style={{
                                border: '1px solid var(--border-color)',
                                borderRadius: 'var(--radius-md)',
                                overflow: 'hidden',
                                backgroundColor: '#ffffff',
                                display: 'flex',
                                flexDirection: 'column',
                                boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                              }}
                            >
                              {/* Photo Preview */}
                              <div style={{ height: '160px', position: 'relative', backgroundColor: '#0f172a' }}>
                                <img
                                  src={item.image_url || '/about_initiative.jpg'}
                                  alt={item.title_mr || item.title}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                  onError={(e) => { e.target.src = '/about_initiative.jpg'; }}
                                />
                                <div style={{
                                  position: 'absolute',
                                  top: '8px',
                                  left: '8px',
                                  background: 'rgba(0,0,0,0.75)',
                                  color: 'var(--accent-saffron)',
                                  padding: '0.2rem 0.6rem',
                                  borderRadius: '9999px',
                                  fontSize: '0.72rem',
                                  fontWeight: 700
                                }}>
                                  {item.category_mr || item.category || 'सामाजिक कार्य'}
                                </div>
                                <div style={{
                                  position: 'absolute',
                                  top: '8px',
                                  right: '8px',
                                  background: 'rgba(0,0,0,0.7)',
                                  color: '#ffffff',
                                  padding: '0.15rem 0.5rem',
                                  borderRadius: '4px',
                                  fontSize: '0.7rem',
                                  fontWeight: 600
                                }}>
                                  #{item.order || idx + 1}
                                </div>
                              </div>

                              {/* Info & Actions */}
                              <div style={{ padding: '1.1rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                <h5 style={{ margin: '0 0 0.35rem 0', fontSize: '0.98rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.35 }}>
                                  {item.title_mr || item.title || 'शीर्षक नाही'}
                                </h5>
                                {item.title && (
                                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
                                    {item.title}
                                  </div>
                                )}

                                {/* Bottom Reorder & Edit / Delete Bar */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                                  {/* Quick Order Up/Down */}
                                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                                    <button
                                      type="button"
                                      disabled={idx === 0}
                                      onClick={() => handleMoveGallery(idx, 'up')}
                                      style={{
                                        padding: '0.4rem',
                                        borderRadius: '4px',
                                        border: '1px solid var(--border-color)',
                                        background: idx === 0 ? '#f1f5f9' : '#ffffff',
                                        color: idx === 0 ? '#cbd5e1' : 'var(--text-main)',
                                        cursor: idx === 0 ? 'not-allowed' : 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                      }}
                                      title="वर घ्या (Move Up)"
                                    >
                                      <ArrowUp size={13} />
                                    </button>
                                    <button
                                      type="button"
                                      disabled={idx === localGallery.length - 1}
                                      onClick={() => handleMoveGallery(idx, 'down')}
                                      style={{
                                        padding: '0.4rem',
                                        borderRadius: '4px',
                                        border: '1px solid var(--border-color)',
                                        background: idx === localGallery.length - 1 ? '#f1f5f9' : '#ffffff',
                                        color: idx === localGallery.length - 1 ? '#cbd5e1' : 'var(--text-main)',
                                        cursor: idx === localGallery.length - 1 ? 'not-allowed' : 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                      }}
                                      title="खाली घ्या (Move Down)"
                                    >
                                      <ArrowDown size={13} />
                                    </button>
                                  </div>

                                  {/* Edit Button */}
                                  <button
                                    type="button"
                                    onClick={() => setEditingGallery({ ...item })}
                                    style={{
                                      flex: 1,
                                      padding: '0.45rem 0.75rem',
                                      borderRadius: '6px',
                                      border: '1px solid var(--primary)',
                                      background: 'var(--primary-light)',
                                      color: 'var(--primary)',
                                      fontWeight: 700,
                                      fontSize: '0.82rem',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      gap: '0.35rem',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    <Edit3 size={14} />
                                    <span>बदला (Edit)</span>
                                  </button>

                                  {/* Delete Button */}
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteGallery(item.id)}
                                    style={{
                                      padding: '0.45rem 0.75rem',
                                      borderRadius: '6px',
                                      border: '1px solid #fecaca',
                                      background: '#fee2e2',
                                      color: '#b91c1c',
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center'
                                    }}
                                    title="छायाचित्र हटवा (Delete)"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}


              {activeTab === 'donations' && (
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)' }}>
                    Donation Records
                  </h4>
                  {donations.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                      No donations recorded yet. Test by submitting a donation above!
                    </div>
                  ) : (
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                        <thead>
                          <tr style={{ background: 'var(--light-bg)', textAlign: 'left', borderBottom: '2px solid var(--border-color)' }}>
                            <th style={{ padding: '0.75rem' }}>Donor Name</th>
                            <th style={{ padding: '0.75rem' }}>Phone</th>
                            <th style={{ padding: '0.75rem' }}>PAN Card</th>
                            <th style={{ padding: '0.75rem' }}>Cause / Purpose</th>
                            <th style={{ padding: '0.75rem' }}>Amount</th>
                            <th style={{ padding: '0.75rem' }}>Ref / Mode</th>
                            <th style={{ padding: '0.75rem' }}>Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {donations.map((d) => (
                            <tr key={d.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                              <td style={{ padding: '0.75rem', fontWeight: 600 }}>{d.donor_name}</td>
                              <td style={{ padding: '0.75rem' }}>{d.donor_phone}</td>
                              <td style={{ padding: '0.75rem', fontFamily: 'monospace' }}>{d.donor_pan || '—'}</td>
                              <td style={{ padding: '0.75rem' }}>{d.cause}</td>
                              <td style={{ padding: '0.75rem', fontWeight: 700, color: 'var(--primary)' }}>₹{d.amount}</td>
                              <td style={{ padding: '0.75rem' }}><span className="badge badge-green">{d.payment_method}</span></td>
                              <td style={{ padding: '0.75rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                {new Date(d.created_at).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'volunteers' && (
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)' }}>
                    Volunteer Applications
                  </h4>
                  {volunteers.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                      No volunteer applications received yet.
                    </div>
                  ) : (
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                        <thead>
                          <tr style={{ background: 'var(--light-bg)', textAlign: 'left', borderBottom: '2px solid var(--border-color)' }}>
                            <th style={{ padding: '0.75rem' }}>Full Name</th>
                            <th style={{ padding: '0.75rem' }}>Phone</th>
                            <th style={{ padding: '0.75rem' }}>Email</th>
                            <th style={{ padding: '0.75rem' }}>Area of Interest</th>
                            <th style={{ padding: '0.75rem' }}>Skills / Profession</th>
                            <th style={{ padding: '0.75rem' }}>Message</th>
                          </tr>
                        </thead>
                        <tbody>
                          {volunteers.map((v) => (
                            <tr key={v.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                              <td style={{ padding: '0.75rem', fontWeight: 600 }}>{v.full_name}</td>
                              <td style={{ padding: '0.75rem' }}>{v.phone}</td>
                              <td style={{ padding: '0.75rem' }}>{v.email || '—'}</td>
                              <td style={{ padding: '0.75rem' }}><span className="badge badge-blue">{v.interest_area}</span></td>
                              <td style={{ padding: '0.75rem' }}>{v.skills || '—'}</td>
                              <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>{v.message || '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'messages' && (
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)' }}>
                    Received Inquiries & Messages
                  </h4>
                  {messages.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                      No contact messages received yet.
                    </div>
                  ) : (
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                        <thead>
                          <tr style={{ background: 'var(--light-bg)', textAlign: 'left', borderBottom: '2px solid var(--border-color)' }}>
                            <th style={{ padding: '0.75rem' }}>Name</th>
                            <th style={{ padding: '0.75rem' }}>Phone</th>
                            <th style={{ padding: '0.75rem' }}>Email</th>
                            <th style={{ padding: '0.75rem' }}>Message</th>
                            <th style={{ padding: '0.75rem' }}>Received Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {messages.map((m) => (
                            <tr key={m.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                              <td style={{ padding: '0.75rem', fontWeight: 600 }}>{m.name}</td>
                              <td style={{ padding: '0.75rem' }}>{m.phone}</td>
                              <td style={{ padding: '0.75rem' }}>{m.email || '—'}</td>
                              <td style={{ padding: '0.75rem', color: 'var(--text-main)', maxWidth: '280px' }}>{m.message}</td>
                              <td style={{ padding: '0.75rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                {new Date(m.created_at).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>,
    document.body
  );
}
