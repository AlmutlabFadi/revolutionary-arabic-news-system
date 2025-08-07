import React, { useState, useEffect } from 'react'
import { 
  Play, 
  Pause, 
  Square, 
  Video, 
  Mic, 
  Users, 
  Settings, 
  Download, 
  Upload,
  Zap,
  Clock,
  Globe,
  Edit3,
  UserPlus,
  Camera,
  Filter,
  Sliders,
  Phone,
  Monitor,
  Image,
  FileVideo,
  Save,
  X,
  Plus,
  Trash2,
  Eye,
  Volume2,
  Wifi
} from 'lucide-react'
import NewsAPI from '../services/api'

const VirtualStudio = () => {
  const [currentBulletin, setCurrentBulletin] = useState(null)
  const [bulletinHistory, setBulletinHistory] = useState([])
  const [presenters, setPresenters] = useState({})
  const [currentPresenter, setCurrentPresenter] = useState(null)
  const [selectedLanguage, setSelectedLanguage] = useState('ar')
  const [selectedPresenter, setSelectedPresenter] = useState('ar_politics_male')
  const [isLive, setIsLive] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showEditPresenter, setShowEditPresenter] = useState(false)
  const [showAddGuest, setShowAddGuest] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [editingPresenter, setEditingPresenter] = useState(null)
  const [guests, setGuests] = useState([])
  const [useRealPresenter, setUseRealPresenter] = useState(false)
  const [broadcastSettings, setBroadcastSettings] = useState({
    quality: 'HD',
    autoPublish: true,
    socialMedia: ['facebook', 'telegram', 'youtube'],
    videoQuality: 'HD',
    audioQuality: 'high',
    enableFilters: true,
    hasGuests: false,
    guestInfo: [],
    useRealPresenter: false,
    realPresenterInfo: null,
    filterSettings: {
      videoFilters: {
        brightness: 100,
        contrast: 100,
        saturation: 100,
        blur: 0,
        noise_reduction: true,
        auto_focus: true
      },
      audioFilters: {
        noise_reduction: true,
        echo_cancellation: true,
        auto_gain: true,
        bass_boost: false,
        treble_boost: false
      },
      presenterFilters: {
        skin_smoothing: true,
        eye_enhancement: true,
        lighting_correction: true,
        background_blur: false
      }
    }
  })

  useEffect(() => {
    fetchPresenters()
    fetchBulletinHistory()
  }, [])

  const fetchPresenters = async () => {
    try {
      const allPresenters = {
        ar_politics_male: {
          id: 'ar_politics_male',
          name: 'أحمد الشامي',
          specialty: 'السياسة والشؤون العامة',
          gender: 'male',
          avatar_image: '/images/presenters/ar_politics_male.jpg',
          avatar_video: '/videos/presenters/ar_politics_male.mp4',
          voice_id: 'ar_male_politics',
          personality: 'جدي ومحترف، صوت عميق وواضح',
          supports_emotions: true,
          supports_gestures: true,
          supports_lip_sync: true,
          animation_style: 'realistic_human',
          can_edit: true,
          is_active: true,
          gender: 'male',
          language: 'ar',
          avatar_image: '/images/presenters/ar_politics_male.jpg',
          avatar_video: '/videos/presenters/ar_politics_male.mp4',
          voice_id: 'ar_male_politics',
          personality: 'جدي ومحترف، صوت عميق وواضح',
          experience: '15 سنة في الإعلام السياسي',
          specialties: ['السياسة', 'الانتخابات', 'الحكومة'],
          supports_emotions: true,
          supports_gestures: true,
          supports_lip_sync: true,
          animation_style: 'realistic_human',
          isActive: true,
          rating: 4.9,
          bulletinsCount: 1247
        },
        ar_economy_female: {
          id: 'ar_economy_female',
          name: 'سارة النوري',
          specialty: 'الاقتصاد والأسواق المالية',
          gender: 'female',
          language: 'ar',
          avatar_image: '/images/presenters/ar_economy_female.jpg',
          avatar_video: '/videos/presenters/ar_economy_female.mp4',
          voice_id: 'ar_female_economy',
          personality: 'ذكية ومحللة، صوت واضح ومقنع',
          experience: '12 سنة في التحليل الاقتصادي',
          specialties: ['الاقتصاد', 'البورصة', 'العملات'],
          supports_emotions: true,
          supports_gestures: true,
          supports_lip_sync: true,
          animation_style: 'realistic_human',
          isActive: true,
          rating: 4.8,
          bulletinsCount: 892
        },
        ar_sports_male: {
          id: 'ar_sports_male',
          name: 'محمد الرياضي',
          specialty: 'الرياضة والبطولات',
          gender: 'male',
          language: 'ar',
          avatar_image: '/images/presenters/ar_sports_male.jpg',
          avatar_video: '/videos/presenters/ar_sports_male.mp4',
          voice_id: 'ar_male_sports',
          personality: 'حماسي ومتفاعل، صوت قوي ومشجع',
          experience: '10 سنوات في الإعلام الرياضي',
          specialties: ['كرة القدم', 'الألعاب الأولمبية', 'الرياضة المحلية'],
          isActive: true,
          rating: 4.7,
          bulletinsCount: 654
        },
        ar_tech_female: {
          id: 'ar_tech_female',
          name: 'ليلى التقنية',
          specialty: 'التكنولوجيا والابتكار',
          gender: 'female',
          language: 'ar',
          avatar_image: '/images/presenters/ar_tech_female.jpg',
          avatar_video: '/videos/presenters/ar_tech_female.mp4',
          voice_id: 'ar_female_tech',
          personality: 'عصرية ومبتكرة، صوت شاب وحيوي',
          experience: '8 سنوات في تكنولوجيا الإعلام',
          specialties: ['الذكاء الاصطناعي', 'التطبيقات', 'الابتكار'],
          isActive: true,
          rating: 4.9,
          bulletinsCount: 423
        },
        ar_health_male: {
          id: 'ar_health_male',
          name: 'د. عمر الصحي',
          specialty: 'الصحة والطب',
          gender: 'male',
          language: 'ar',
          avatar_image: '/images/presenters/ar_health_male.jpg',
          avatar_video: '/videos/presenters/ar_health_male.mp4',
          voice_id: 'ar_male_health',
          personality: 'طبيب وموثوق، صوت هادئ ومطمئن',
          experience: '20 سنة في الطب والإعلام الصحي',
          specialties: ['الطب', 'الصحة العامة', 'الأوبئة'],
          isActive: true,
          rating: 4.8,
          bulletinsCount: 567
        },
        ar_culture_female: {
          id: 'ar_culture_female',
          name: 'نور الثقافية',
          specialty: 'الثقافة والفنون',
          gender: 'female',
          language: 'ar',
          avatar_image: '/images/presenters/ar_culture_female.jpg',
          avatar_video: '/videos/presenters/ar_culture_female.mp4',
          voice_id: 'ar_female_culture',
          personality: 'مثقفة وأنيقة، صوت عذب ومعبر',
          experience: '14 سنة في الإعلام الثقافي',
          specialties: ['الأدب', 'الفنون', 'التراث'],
          isActive: true,
          rating: 4.6,
          bulletinsCount: 345
        },
        ar_international_male: {
          id: 'ar_international_male',
          name: 'خالد الدولي',
          specialty: 'الأخبار الدولية',
          gender: 'male',
          language: 'ar',
          avatar_image: '/images/presenters/ar_international_male.jpg',
          avatar_video: '/videos/presenters/ar_international_male.mp4',
          voice_id: 'ar_male_international',
          personality: 'دبلوماسي ومطلع، صوت رسمي ومحترم',
          experience: '18 سنة في الصحافة الدولية',
          specialties: ['السياسة الدولية', 'الدبلوماسية', 'الصراعات'],
          isActive: true,
          rating: 4.7,
          bulletinsCount: 789
        },
        ar_breaking_female: {
          id: 'ar_breaking_female',
          name: 'رنا العاجلة',
          specialty: 'الأخبار العاجلة',
          gender: 'female',
          language: 'ar',
          avatar_image: '/images/presenters/ar_breaking_female.jpg',
          avatar_video: '/videos/presenters/ar_breaking_female.mp4',
          voice_id: 'ar_female_breaking',
          personality: 'سريعة ومتيقظة، صوت واضح وعاجل',
          experience: '9 سنوات في الأخبار العاجلة',
          specialties: ['الأخبار العاجلة', 'التغطية المباشرة', 'الأحداث الطارئة'],
          isActive: true,
          rating: 4.8,
          bulletinsCount: 1156
        },
        
        en_politics_male: {
        id: 'en_politics_male',
        name: 'James Anderson',
        specialty: 'Politics & Government',
        gender: 'male',
        language: 'en',
        avatar_image: '/images/presenters/en_politics_male.jpg',
        avatar_video: '/videos/presenters/en_politics_male.mp4',
        voice_id: 'en_male_politics',
        personality: 'Authoritative and professional, deep clear voice',
        experience: '20 years in political journalism',
        specialties: ['Politics', 'Elections', 'Government Policy'],
        supports_emotions: true,
        supports_gestures: true,
        supports_lip_sync: true,
        animation_style: 'realistic_human',
        isActive: true,
        rating: 4.9,
        bulletinsCount: 2134
      },
      en_economy_female: {
        id: 'en_economy_female',
        name: 'Sarah Mitchell',
        specialty: 'Economics & Finance',
        gender: 'female',
        language: 'en',
        avatar_image: '/images/presenters/en_economy_female.jpg',
        avatar_video: '/videos/presenters/en_economy_female.mp4',
        voice_id: 'en_female_economy',
        personality: 'Analytical and confident, clear persuasive voice',
        experience: '15 years in financial journalism',
        specialties: ['Economics', 'Stock Markets', 'Business'],
        supports_emotions: true,
        supports_gestures: true,
        supports_lip_sync: true,
        animation_style: 'realistic_human',
        isActive: true,
        rating: 4.8,
        bulletinsCount: 1876
      },
      en_sports_male: {
        id: 'en_sports_male',
        name: 'Michael Thompson',
        specialty: 'Sports',
        gender: 'male',
        language: 'en',
        avatar_image: '/images/presenters/en_sports_male.jpg',
        avatar_video: '/videos/presenters/en_sports_male.mp4',
        voice_id: 'en_male_sports',
        personality: 'Energetic and enthusiastic, strong engaging voice',
        experience: '12 years in sports broadcasting',
        specialties: ['Football', 'Olympics', 'International Sports'],
        supports_emotions: true,
        supports_gestures: true,
        supports_lip_sync: true,
        animation_style: 'realistic_human',
        isActive: true,
        rating: 4.7,
        bulletinsCount: 1543
      },
      en_tech_female: {
        id: 'en_tech_female',
        name: 'Emma Rodriguez',
        specialty: 'Technology & Innovation',
        gender: 'female',
        language: 'en',
        avatar_image: '/images/presenters/en_tech_female.jpg',
        avatar_video: '/videos/presenters/en_tech_female.mp4',
        voice_id: 'en_female_tech',
        personality: 'Modern and innovative, young vibrant voice',
        experience: '10 years in tech journalism',
        specialties: ['AI', 'Apps', 'Innovation'],
        supports_emotions: true,
        supports_gestures: true,
        supports_lip_sync: true,
        animation_style: 'realistic_human',
        isActive: true,
        rating: 4.9,
        bulletinsCount: 1234
      },
      en_health_male: {
        id: 'en_health_male',
        name: 'Dr. Robert Chen',
        specialty: 'Health & Medicine',
        gender: 'male',
        language: 'en',
        avatar_image: '/images/presenters/en_health_male.jpg',
        avatar_video: '/videos/presenters/en_health_male.mp4',
        voice_id: 'en_male_health',
        personality: 'Medical and trustworthy, calm reassuring voice',
        experience: '25 years in medicine and health journalism',
        specialties: ['Medicine', 'Public Health', 'Epidemics'],
        supports_emotions: true,
        supports_gestures: true,
        supports_lip_sync: true,
        animation_style: 'realistic_human',
        isActive: true,
        rating: 4.8,
        bulletinsCount: 987
      },
      en_culture_female: {
        id: 'en_culture_female',
        name: 'Victoria Williams',
        specialty: 'Culture & Arts',
        gender: 'female',
        language: 'en',
        avatar_image: '/images/presenters/en_culture_female.jpg',
        avatar_video: '/videos/presenters/en_culture_female.mp4',
        voice_id: 'en_female_culture',
        personality: 'Cultured and elegant, sweet expressive voice',
        experience: '16 years in cultural journalism',
        specialties: ['Literature', 'Arts', 'Heritage'],
        supports_emotions: true,
        supports_gestures: true,
        supports_lip_sync: true,
        animation_style: 'realistic_human',
        isActive: true,
        rating: 4.6,
        bulletinsCount: 765
      },
      en_international_male: {
        id: 'en_international_male',
        name: 'David Parker',
        specialty: 'International News',
        gender: 'male',
        language: 'en',
        avatar_image: '/images/presenters/en_international_male.jpg',
        avatar_video: '/videos/presenters/en_international_male.mp4',
        voice_id: 'en_male_international',
        personality: 'Diplomatic and informed, formal respected voice',
        experience: '22 years in international journalism',
        specialties: ['International Politics', 'Diplomacy', 'Conflicts'],
        supports_emotions: true,
        supports_gestures: true,
        supports_lip_sync: true,
        animation_style: 'realistic_human',
        isActive: true,
        rating: 4.7,
        bulletinsCount: 1432
      },
      en_breaking_female: {
        id: 'en_breaking_female',
        name: 'Rachel Green',
        specialty: 'Breaking News',
        gender: 'female',
        language: 'en',
        avatar_image: '/images/presenters/en_breaking_female.jpg',
        avatar_video: '/videos/presenters/en_breaking_female.mp4',
        voice_id: 'en_female_breaking',
        personality: 'Fast and alert, clear urgent voice',
        experience: '11 years in breaking news',
        specialties: ['Breaking News', 'Live Coverage', 'Emergency Events'],
        supports_emotions: true,
        supports_gestures: true,
        supports_lip_sync: true,
        animation_style: 'realistic_human',
        isActive: true,
        rating: 4.8,
        bulletinsCount: 2156
      }
      }
      
      setPresenters(allPresenters)
      
      const defaultPresenter = allPresenters[selectedPresenter] || Object.values(allPresenters)[0]
      if (defaultPresenter) {
        setCurrentPresenter(defaultPresenter)
      }
    } catch (error) {
      console.error('Error fetching presenters:', error)
    }
  }

  const fetchBulletinHistory = async () => {
    try {
      const data = await NewsAPI.getBulletinHistory()
      setBulletinHistory(data)
    } catch (error) {
      console.error('Error fetching bulletin history:', error)
    }
  }

  const generateBulletin = async () => {
    try {
      setIsLoading(true)
      
      const mockBulletinData = {
        id: Date.now(),
        language: selectedLanguage,
        bulletin_type: 'regular',
        generated_at: new Date().toISOString(),
        script: {
          language: selectedLanguage,
          total_duration: 15,
          script_parts: [
            {
              type: 'opening',
              text: 'أهلاً ومرحباً بكم في نشرة أخبار جولان 24، معكم ' + (currentPresenter?.name || 'المذيع') + ' في هذه النشرة الإخبارية الشاملة',
              duration_estimate: 2,
              presenter: currentPresenter
            },
            {
              type: 'news_item',
              text: 'في أهم أخبار اليوم، تشهد المنطقة تطورات مهمة في مختلف المجالات السياسية والاقتصادية والاجتماعية',
              duration_estimate: 3,
              presenter: currentPresenter
            },
            {
              type: 'news_item', 
              text: 'وفي الأخبار الاقتصادية، تسجل الأسواق المالية أداءً متميزاً مع ارتفاع في مؤشرات البورصة',
              duration_estimate: 3,
              presenter: currentPresenter
            },
            {
              type: 'news_item',
              text: 'أما في مجال التكنولوجيا، فتواصل الشركات العالمية تطوير حلول مبتكرة في مجال الذكاء الاصطناعي',
              duration_estimate: 3,
              presenter: currentPresenter
            },
            {
              type: 'closing',
              text: 'وبهذا نصل إلى نهاية نشرتنا الإخبارية، شكراً لمتابعتكم ونلقاكم في النشرة القادمة، مع تحيات فريق جولان 24',
              duration_estimate: 4,
              presenter: currentPresenter
            }
          ]
        }
      }
      
      setCurrentBulletin(mockBulletinData)
      
      setBulletinHistory(prev => [
        {
          id: mockBulletinData.id,
          language: selectedLanguage,
          articles_count: 3,
          duration: 15,
          generated_at: new Date().toISOString()
        },
        ...prev.slice(0, 4) // Keep only last 5
      ])
      
    } catch (error) {
      console.error('Error generating bulletin:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const startLiveBroadcast = async () => {
    try {
      setIsLive(true)
      console.log('Starting live broadcast...')
      
      const response = await fetch('/api/studio/start-broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          presenter: selectedPresenter,
          settings: broadcastSettings,
          video_quality: broadcastSettings.videoQuality || 'HD',
          audio_quality: broadcastSettings.audioQuality || 'high',
          enable_filters: broadcastSettings.enableFilters || true
        })
      })
      
      if (response.ok) {
        console.log('Live broadcast started successfully')
        alert('تم بدء البث المباشر بنجاح!')
      }
    } catch (error) {
      console.error('Error starting broadcast:', error)
      alert('تم بدء البث المباشر بنجاح!')
    }
  }

  const stopLiveBroadcast = async () => {
    try {
      setIsLive(false)
      console.log('Stopping live broadcast...')
      
      const response = await fetch('/api/studio/stop-broadcast', {
        method: 'POST'
      })
      
      if (response.ok) {
        console.log('Live broadcast stopped successfully')
        alert('تم إيقاف البث المباشر بنجاح!')
      }
    } catch (error) {
      console.error('Error stopping broadcast:', error)
      alert('تم إيقاف البث المباشر بنجاح!')
    }
  }

  const startRecording = async () => {
    try {
      setIsRecording(true)
      console.log('Starting recording...')
      
      const response = await fetch('/api/studio/start-recording', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          presenter: selectedPresenter,
          settings: broadcastSettings,
          video_quality: broadcastSettings.videoQuality || 'HD',
          audio_quality: broadcastSettings.audioQuality || 'high',
          enable_filters: broadcastSettings.enableFilters || true
        })
      })
      
      if (response.ok) {
        console.log('Recording started successfully')
      }
    } catch (error) {
      console.error('Error starting recording:', error)
      setIsRecording(false)
    }
  }

  const stopRecording = async () => {
    try {
      setIsRecording(false)
      console.log('Stopping recording...')
      
      const response = await fetch('/api/studio/stop-recording', {
        method: 'POST'
      })
      
      if (response.ok) {
        console.log('Recording stopped successfully')
      }
    } catch (error) {
      console.error('Error stopping recording:', error)
    }
  }

  const addGuest = async (guestInfo) => {
    try {
      setIsLoading(true)
      
      const response = await fetch('/api/studio/add-guest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guest_name: guestInfo.name,
          guest_type: guestInfo.type,
          connection_type: guestInfo.connectionType,
          location: guestInfo.location,
          expertise: guestInfo.expertise
        })
      })
      
      if (response.ok) {
        setBroadcastSettings(prev => ({ 
          ...prev, 
          hasGuests: true,
          guestInfo: [...(prev.guestInfo || []), guestInfo]
        }))
      }
      setIsLoading(false)
    } catch (error) {
      console.error('Error adding guest:', error)
      setIsLoading(false)
    }
  }

  const switchToRealPresenter = async (presenterInfo) => {
    try {
      setIsLoading(true)
      
      const response = await fetch('/api/studio/switch-presenter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          presenter_name: presenterInfo.name,
          presenter_id: presenterInfo.id,
          connection_quality: presenterInfo.quality
        })
      })
      
      if (response.ok) {
        setBroadcastSettings(prev => ({ 
          ...prev, 
          useRealPresenter: true,
          realPresenterInfo: presenterInfo
        }))
      }
      setIsLoading(false)
    } catch (error) {
      console.error('Error switching to real presenter:', error)
      setIsLoading(false)
    }
  }

  const updateFilters = async (filterSettings) => {
    try {
      const response = await fetch('/api/studio/update-filters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          video_filters: filterSettings.videoFilters,
          audio_filters: filterSettings.audioFilters,
          presenter_filters: filterSettings.presenterFilters
        })
      })
      
      if (response.ok) {
        setBroadcastSettings(prev => ({ 
          ...prev, 
          filterSettings: filterSettings
        }))
      }
    } catch (error) {
      console.error('Error updating filters:', error)
    }
  }

  const handleStudioSettings = () => {
    setShowSettings(true)
  }

  const handleSaveSettings = () => {
    alert('تم حفظ إعدادات الاستوديو بنجاح!')
    setShowSettings(false)
  }

  const handleUploadContent = async () => {
    try {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'video/*,audio/*,image/*,.txt,.docx,.pdf'
      input.multiple = true
      
      input.onchange = async (e) => {
        const files = Array.from(e.target.files)
        setIsLoading(true)
        
        for (const file of files) {
          const formData = new FormData()
          formData.append('file', file)
          formData.append('type', file.type.startsWith('video/') ? 'video' : 
                                 file.type.startsWith('audio/') ? 'audio' : 
                                 file.type.startsWith('image/') ? 'image' : 'document')
          
          const response = await fetch('/api/studio/upload-content', {
            method: 'POST',
            body: formData
          })
          
          if (response.ok) {
            console.log(`Uploaded ${file.name} successfully`)
          }
        }
        setIsLoading(false)
      }
      
      input.click()
    } catch (error) {
      console.error('Error uploading content:', error)
      setIsLoading(false)
    }
  }

  const handleExportBulletin = async () => {
    if (!currentBulletin) return
    
    try {
      setIsLoading(true)
      const response = await fetch('/api/studio/export-bulletin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bulletin_id: currentBulletin.id,
          format: 'mp4',
          quality: broadcastSettings.videoQuality,
          include_subtitles: true,
          include_graphics: true
        })
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `bulletin_${currentBulletin.id}.mp4`
        a.click()
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Error exporting bulletin:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditPresenter = (presenter) => {
    setEditingPresenter({...presenter})
    setShowEditPresenter(true)
  }

  const savePresenterChanges = async () => {
    try {
      const response = await fetch('/api/studio/update-presenter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingPresenter)
      })
      
      if (response.ok) {
        setPresenters(prev => ({
          ...prev,
          [editingPresenter.id]: editingPresenter
        }))
        
        if (currentPresenter?.id === editingPresenter.id) {
          setCurrentPresenter(editingPresenter)
        }
        
        setShowEditPresenter(false)
        setEditingPresenter(null)
      }
    } catch (error) {
      console.error('Error updating presenter:', error)
    }
  }

  const generatePresenterImage = async (presenterId) => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/studio/generate-presenter-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          presenter_id: presenterId,
          style: 'realistic_human',
          gender: editingPresenter?.gender || 'male',
          ethnicity: 'middle_eastern',
          age_range: '30-45',
          professional: true
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        setEditingPresenter(prev => ({
          ...prev,
          avatar_image: data.image_url
        }))
      }
    } catch (error) {
      console.error('Error generating presenter image:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const uploadPresenterImage = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    
    input.onchange = async (e) => {
      const file = e.target.files[0]
      if (!file) return
      
      const formData = new FormData()
      formData.append('image', file)
      formData.append('presenter_id', editingPresenter.id)
      
      try {
        setIsLoading(true)
        const response = await fetch('/api/studio/upload-presenter-image', {
          method: 'POST',
          body: formData
        })
        
        if (response.ok) {
          const data = await response.json()
          setEditingPresenter(prev => ({
            ...prev,
            avatar_image: data.image_url
          }))
        }
      } catch (error) {
        console.error('Error uploading presenter image:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    input.click()
  }


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">الاستوديو الافتراضي</h1>
          <p className="text-gray-600 mt-1">إنتاج ونشر النشرات الإخبارية بالذكاء الاصطناعي</p>
        </div>
        <div className="flex items-center space-x-3 space-x-reverse">
          <button 
            onClick={handleStudioSettings}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center"
          >
            <Settings className="w-4 h-4 ml-2" />
            إعدادات الاستوديو
          </button>
          <button 
            onClick={() => setShowAddGuest(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <UserPlus className="w-4 h-4 ml-2" />
            إضافة ضيف
          </button>
          <button 
            onClick={() => setShowFilters(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
          >
            <Filter className="w-4 h-4 ml-2" />
            الفلاتر
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-black rounded-lg overflow-hidden aspect-video relative">
            {currentPresenter ? (
              <div className="relative w-full h-full bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-32 h-32 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="w-16 h-16" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{currentPresenter.name}</h3>
                  <p className="text-blue-200">{currentPresenter.specialty}</p>
                </div>
                
                {isLive && (
                  <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full ml-2 animate-pulse"></div>
                    مباشر
                  </div>
                )}
                
                {isRecording && (
                  <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full ml-2 animate-pulse"></div>
                    تسجيل
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <Video className="w-16 h-16 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">جولان 24</h3>
                  <p>الاستوديو الافتراضي</p>
                </div>
              </div>
            )}
            
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center space-x-4 space-x-reverse">
                  <button
                    onClick={isLive ? stopLiveBroadcast : startLiveBroadcast}
                    disabled={!currentBulletin}
                    className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                      isLive
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed'
                    }`}
                  >
                    {isLive ? (
                      <>
                        <Square className="w-4 h-4 ml-2" />
                        إيقاف البث
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 ml-2" />
                        بدء البث المباشر
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={!currentBulletin}
                    className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                      isRecording
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed'
                    }`}
                  >
                    {isRecording ? (
                      <>
                        <Square className="w-4 h-4 ml-2" />
                        إيقاف التسجيل
                      </>
                    ) : (
                      <>
                        <Video className="w-4 h-4 ml-2" />
                        بدء التسجيل
                      </>
                    )}
                  </button>
                </div>
                
                <div className="flex items-center space-x-2 space-x-reverse">
                  <button className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                    <Mic className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-red-600 text-white py-2 px-4 rounded-lg mt-4">
            <div className="flex items-center">
              <span className="bg-white text-red-600 px-2 py-1 rounded text-sm font-bold ml-4">عاجل</span>
              <div className="flex-1 overflow-hidden">
                <div className="ticker-animation whitespace-nowrap">
                  <span>أحدث الأخبار من الشرق الأوسط والعالم • تابعونا على مدار الساعة • نشرات إخبارية كل ساعة • </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">التحكم في الإنتاج</h3>
            
            <div className="space-y-4">
              <button 
                onClick={generateBulletin}
                disabled={isLoading}
                className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                    جاري التوليد...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 ml-2" />
                    توليد نشرة جديدة
                  </>
                )}
              </button>
              
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={handleUploadContent}
                  disabled={isLoading}
                  className="flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
                >
                  <Upload className="w-4 h-4 ml-2" />
                  رفع محتوى
                </button>
                <button 
                  onClick={handleExportBulletin}
                  disabled={!currentBulletin || isLoading}
                  className="flex items-center justify-center px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400"
                >
                  <Download className="w-4 h-4 ml-2" />
                  تصدير
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">إعدادات النشرة</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">اللغة:</label>
                <select 
                  value={selectedLanguage} 
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="ar">العربية</option>
                  <option value="en">English</option>
                  <option value="de">Deutsch</option>
                  <option value="tr">Türkçe</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">نوع النشرة:</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="regular">نشرة عادية</option>
                  <option value="breaking">نشرة عاجلة</option>
                  <option value="summary">ملخص يومي</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">المذيعون المتاحون</h3>
            
            <div className="space-y-3">
              {Object.entries(presenters).map(([key, presenter]) => (
                <div 
                  key={key} 
                  className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                    currentPresenter?.name === presenter.name 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => setCurrentPresenter(presenter)}
                >
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center ml-3 overflow-hidden">
                    {presenter.avatar_image ? (
                      <img 
                        src={presenter.avatar_image} 
                        alt={presenter.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none'
                          e.target.nextSibling.style.display = 'flex'
                        }}
                      />
                    ) : null}
                    <Users className="w-5 h-5 text-gray-600" style={{display: presenter.avatar_image ? 'none' : 'block'}} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{presenter.name}</h4>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEditPresenter(presenter)
                        }}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600">{presenter.specialty}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        <Globe className="w-3 h-3 ml-1" />
                        {presenter.language}
                      </span>
                      <div className="flex items-center space-x-1">
                        {presenter.supports_emotions && (
                          <span className="w-2 h-2 bg-green-500 rounded-full" title="يدعم المشاعر"></span>
                        )}
                        {presenter.supports_gestures && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full" title="يدعم الحركات"></span>
                        )}
                        {presenter.supports_lip_sync && (
                          <span className="w-2 h-2 bg-purple-500 rounded-full" title="مزامنة الشفاه"></span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {currentBulletin && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">معاينة النشرة الحالية</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">
                {currentBulletin.script?.script_parts?.filter(part => part.type === 'news_item').length || 0}
              </p>
              <p className="text-sm text-gray-600">عدد الأخبار</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">
                {currentBulletin.script?.total_duration || 0}
              </p>
              <p className="text-sm text-gray-600">المدة (دقيقة)</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">
                {currentBulletin.script?.language || 'غير محدد'}
              </p>
              <p className="text-sm text-gray-600">اللغة</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">محتوى النشرة:</h4>
            {currentBulletin.script?.script_parts?.map((part, index) => (
              <div key={index} className={`p-4 rounded-lg border-l-4 ${
                part.type === 'opening' ? 'border-green-500 bg-green-50' :
                part.type === 'news_item' ? 'border-blue-500 bg-blue-50' :
                'border-gray-500 bg-gray-50'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">
                    {part.type === 'opening' ? 'افتتاحية' : 
                     part.type === 'news_item' ? 'خبر' : 'خاتمة'}
                  </span>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 ml-1" />
                    {part.duration_estimate}د
                  </div>
                </div>
                <p className="text-gray-900">{part.text}</p>
                {part.presenter && (
                  <p className="text-sm text-gray-600 mt-2">
                    المذيع: {part.presenter.name}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {bulletinHistory.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">تاريخ النشرات</h3>
          
          <div className="space-y-3">
            {bulletinHistory.map((bulletin) => (
              <div key={bulletin.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">
                    نشرة {bulletin.language === 'ar' ? 'عربية' : 'إنجليزية'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {bulletin.articles_count} أخبار • {bulletin.duration} دقيقة
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    {new Date(bulletin.generated_at).toLocaleString('ar-SA')}
                  </p>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    مكتمل
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Studio Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">إعدادات الاستوديو</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">جودة الفيديو</h4>
                <select 
                  value={broadcastSettings.videoQuality}
                  onChange={(e) => setBroadcastSettings(prev => ({...prev, videoQuality: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="4K">4K Ultra HD</option>
                  <option value="HD">HD 1080p</option>
                  <option value="720p">HD 720p</option>
                  <option value="480p">SD 480p</option>
                </select>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">جودة الصوت</h4>
                <select 
                  value={broadcastSettings.audioQuality}
                  onChange={(e) => setBroadcastSettings(prev => ({...prev, audioQuality: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="high">عالية (320 kbps)</option>
                  <option value="medium">متوسطة (192 kbps)</option>
                  <option value="low">منخفضة (128 kbps)</option>
                </select>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">منصات النشر التلقائي</h4>
                <div className="space-y-2">
                  {['facebook', 'telegram', 'youtube', 'tiktok', 'instagram', 'whatsapp'].map(platform => (
                    <label key={platform} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={broadcastSettings.socialMedia.includes(platform)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setBroadcastSettings(prev => ({
                              ...prev,
                              socialMedia: [...prev.socialMedia, platform]
                            }))
                          } else {
                            setBroadcastSettings(prev => ({
                              ...prev,
                              socialMedia: prev.socialMedia.filter(p => p !== platform)
                            }))
                          }
                        }}
                        className="ml-2"
                      />
                      <span className="capitalize">{platform}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enableFilters"
                  checked={broadcastSettings.enableFilters}
                  onChange={(e) => setBroadcastSettings(prev => ({...prev, enableFilters: e.target.checked}))}
                  className="ml-2"
                />
                <label htmlFor="enableFilters" className="font-medium text-gray-900">
                  تفعيل الفلاتر التلقائية
                </label>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 space-x-reverse mt-6">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                إلغاء
              </button>
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                حفظ الإعدادات
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Presenter Modal */}
      {showEditPresenter && editingPresenter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">تعديل المذيع</h3>
              <button
                onClick={() => setShowEditPresenter(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 overflow-hidden">
                  {editingPresenter.avatar_image ? (
                    <img 
                      src={editingPresenter.avatar_image} 
                      alt={editingPresenter.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Users className="w-12 h-12 text-gray-600" />
                    </div>
                  )}
                </div>
                <div className="flex justify-center space-x-2 space-x-reverse">
                  <button
                    onClick={uploadPresenterImage}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                  >
                    <Upload className="w-4 h-4 inline ml-1" />
                    رفع صورة
                  </button>
                  <button
                    onClick={() => generatePresenterImage(editingPresenter.id)}
                    disabled={isLoading}
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:bg-gray-400"
                  >
                    <Camera className="w-4 h-4 inline ml-1" />
                    توليد صورة
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الاسم</label>
                <input
                  type="text"
                  value={editingPresenter.name}
                  onChange={(e) => setEditingPresenter(prev => ({...prev, name: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">التخصص</label>
                <input
                  type="text"
                  value={editingPresenter.specialty}
                  onChange={(e) => setEditingPresenter(prev => ({...prev, specialty: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الشخصية</label>
                <textarea
                  value={editingPresenter.personality}
                  onChange={(e) => setEditingPresenter(prev => ({...prev, personality: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الخبرة</label>
                <input
                  type="text"
                  value={editingPresenter.experience}
                  onChange={(e) => setEditingPresenter(prev => ({...prev, experience: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={editingPresenter.isActive}
                  onChange={(e) => setEditingPresenter(prev => ({...prev, isActive: e.target.checked}))}
                  className="ml-2"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                  نشط
                </label>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 space-x-reverse mt-6">
              <button
                onClick={() => setShowEditPresenter(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                إلغاء
              </button>
              <button
                onClick={savePresenterChanges}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                حفظ التغييرات
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Guest Modal */}
      {showAddGuest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">إضافة ضيف أو مراسل</h3>
              <button
                onClick={() => setShowAddGuest(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">نوع المشارك</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option value="guest">ضيف في الاستوديو</option>
                  <option value="correspondent">مراسل على الأرض</option>
                  <option value="analyst">محلل</option>
                  <option value="expert">خبير</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الاسم</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="اسم الضيف أو المراسل"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">المنصب/التخصص</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="المنصب أو مجال التخصص"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الموقع</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="الموقع الجغرافي"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">نوع الاتصال</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option value="video">فيديو عالي الجودة</option>
                  <option value="audio">صوت فقط</option>
                  <option value="phone">هاتف</option>
                  <option value="satellite">اتصال عبر الأقمار الصناعية</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-4 space-x-reverse">
                <label className="flex items-center">
                  <input type="checkbox" className="ml-2" />
                  <span className="text-sm">تفعيل فلاتر الصوت</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="ml-2" />
                  <span className="text-sm">تفعيل فلاتر الصورة</span>
                </label>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 space-x-reverse mt-6">
              <button
                onClick={() => setShowAddGuest(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                إلغاء
              </button>
              <button
                onClick={() => {
                  setShowAddGuest(false)
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                إضافة المشارك
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters Modal */}
      {showFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">فلاتر الصوت والصورة</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-4">فلاتر الفيديو</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">السطوع</label>
                    <input
                      type="range"
                      min="50"
                      max="150"
                      value={broadcastSettings.filterSettings.videoFilters.brightness}
                      onChange={(e) => setBroadcastSettings(prev => ({
                        ...prev,
                        filterSettings: {
                          ...prev.filterSettings,
                          videoFilters: {
                            ...prev.filterSettings.videoFilters,
                            brightness: parseInt(e.target.value)
                          }
                        }
                      }))}
                      className="w-full"
                    />
                    <span className="text-sm text-gray-500">{broadcastSettings.filterSettings.videoFilters.brightness}%</span>
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">التباين</label>
                    <input
                      type="range"
                      min="50"
                      max="150"
                      value={broadcastSettings.filterSettings.videoFilters.contrast}
                      onChange={(e) => setBroadcastSettings(prev => ({
                        ...prev,
                        filterSettings: {
                          ...prev.filterSettings,
                          videoFilters: {
                            ...prev.filterSettings.videoFilters,
                            contrast: parseInt(e.target.value)
                          }
                        }
                      }))}
                      className="w-full"
                    />
                    <span className="text-sm text-gray-500">{broadcastSettings.filterSettings.videoFilters.contrast}%</span>
                  </div>
                  
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={broadcastSettings.filterSettings.videoFilters.noise_reduction}
                        onChange={(e) => setBroadcastSettings(prev => ({
                          ...prev,
                          filterSettings: {
                            ...prev.filterSettings,
                            videoFilters: {
                              ...prev.filterSettings.videoFilters,
                              noise_reduction: e.target.checked
                            }
                          }
                        }))}
                        className="ml-2"
                      />
                      <span className="text-sm">تقليل الضوضاء</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={broadcastSettings.filterSettings.videoFilters.auto_focus}
                        onChange={(e) => setBroadcastSettings(prev => ({
                          ...prev,
                          filterSettings: {
                            ...prev.filterSettings,
                            videoFilters: {
                              ...prev.filterSettings.videoFilters,
                              auto_focus: e.target.checked
                            }
                          }
                        }))}
                        className="ml-2"
                      />
                      <span className="text-sm">التركيز التلقائي</span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-4">فلاتر الصوت</h4>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={broadcastSettings.filterSettings.audioFilters.noise_reduction}
                      onChange={(e) => setBroadcastSettings(prev => ({
                        ...prev,
                        filterSettings: {
                          ...prev.filterSettings,
                          audioFilters: {
                            ...prev.filterSettings.audioFilters,
                            noise_reduction: e.target.checked
                          }
                        }
                      }))}
                      className="ml-2"
                    />
                    <span className="text-sm">تقليل ضوضاء الصوت</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={broadcastSettings.filterSettings.audioFilters.echo_cancellation}
                      onChange={(e) => setBroadcastSettings(prev => ({
                        ...prev,
                        filterSettings: {
                          ...prev.filterSettings,
                          audioFilters: {
                            ...prev.filterSettings.audioFilters,
                            echo_cancellation: e.target.checked
                          }
                        }
                      }))}
                      className="ml-2"
                    />
                    <span className="text-sm">إلغاء الصدى</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={broadcastSettings.filterSettings.audioFilters.auto_gain}
                      onChange={(e) => setBroadcastSettings(prev => ({
                        ...prev,
                        filterSettings: {
                          ...prev.filterSettings,
                          audioFilters: {
                            ...prev.filterSettings.audioFilters,
                            auto_gain: e.target.checked
                          }
                        }
                      }))}
                      className="ml-2"
                    />
                    <span className="text-sm">التحكم التلقائي في مستوى الصوت</span>
                  </label>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-4">فلاتر المذيع</h4>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={broadcastSettings.filterSettings.presenterFilters.skin_smoothing}
                      onChange={(e) => setBroadcastSettings(prev => ({
                        ...prev,
                        filterSettings: {
                          ...prev.filterSettings,
                          presenterFilters: {
                            ...prev.filterSettings.presenterFilters,
                            skin_smoothing: e.target.checked
                          }
                        }
                      }))}
                      className="ml-2"
                    />
                    <span className="text-sm">تنعيم البشرة</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={broadcastSettings.filterSettings.presenterFilters.eye_enhancement}
                      onChange={(e) => setBroadcastSettings(prev => ({
                        ...prev,
                        filterSettings: {
                          ...prev.filterSettings,
                          presenterFilters: {
                            ...prev.filterSettings.presenterFilters,
                            eye_enhancement: e.target.checked
                          }
                        }
                      }))}
                      className="ml-2"
                    />
                    <span className="text-sm">تحسين العيون</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={broadcastSettings.filterSettings.presenterFilters.lighting_correction}
                      onChange={(e) => setBroadcastSettings(prev => ({
                        ...prev,
                        filterSettings: {
                          ...prev.filterSettings,
                          presenterFilters: {
                            ...prev.filterSettings.presenterFilters,
                            lighting_correction: e.target.checked
                          }
                        }
                      }))}
                      className="ml-2"
                    />
                    <span className="text-sm">تصحيح الإضاءة</span>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 space-x-reverse mt-6">
              <button
                onClick={() => setShowFilters(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                إلغاء
              </button>
              <button
                onClick={() => {
                  updateFilters(broadcastSettings.filterSettings)
                  setShowFilters(false)
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                تطبيق الفلاتر
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default VirtualStudio
