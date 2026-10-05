from sqlalchemy.orm import Session
from . import models

def seed_initial_data(db: Session):
    # Check if TrustInfo exists
    info = db.query(models.TrustInfo).first()
    if not info:
        info = models.TrustInfo(
            name="Payal Foundation and Social Service",
            tagline="Empowering Communities, Serving Humanity",
            tagline_mr="सक्षम समाज, समृद्ध भविष्य आणि मानवतेची निरंतर सेवा",
            reg_no="G.B.B.S.D 409/2026 | F-82401 (M)",
            act_name="Public Trust Act, Govt. of Maharashtra",
            president="Zakir Hussain",
            secretary="Mohd Rahim Abdul Kalam Khan",
            phone="+91 77768 76121",
            email="contact@payalfoundation.org",
            address="Gala No D 1, Aana Sagar Scrap Market, Kurla-Andheri Road, Near Naaz Hotel, Jarimari, Sakinaka, Mumbai - 400072",
            bank_name="State Bank of India (SBI)",
            bank_account_no="428901238910",
            bank_ifsc="SBIN0001234",
            upi_id="payalfoundation@ybl"
        )
        db.add(info)
        db.commit()

    # Check if Trustees exist
    if db.query(models.Trustee).count() == 0:
        trustees = [
            models.Trustee(name="Sonya Oghe", role="President", role_mr="अध्यक्ष (President)", photo_url="/sonya.jpg", order=1),
            models.Trustee(name="Sonya Oghe", role="Secretary", role_mr="सचिव (Secretary)", photo_url="/sonya.jpg", order=2),
            models.Trustee(name="Sonya Oghe", role="Trust Member", role_mr="विश्वस्त सदस्य (Trust Member)", photo_url="/sonya.jpg", order=3),
            models.Trustee(name="Sonya Oghe", role="Trust Member", role_mr="विश्वस्त सदस्य (Trust Member)", photo_url="/sonya.jpg", order=4),
            models.Trustee(name="Sonya Oghe", role="Trust Member", role_mr="विश्वस्त सदस्य (Trust Member)", photo_url="/sonya.jpg", order=5),
            models.Trustee(name="Sonya Oghe", role="Trust Member", role_mr="विश्वस्त सदस्य (Trust Member)", photo_url="/sonya.jpg", order=6),
            models.Trustee(name="Sonya Oghe", role="Trust Member", role_mr="विश्वस्त सदस्य (Trust Member)", photo_url="/sonya.jpg", order=7),
            models.Trustee(name="Sonya Oghe", role="Trust Member", role_mr="विश्वस्त सदस्य (Trust Member)", photo_url="/sonya.jpg", order=8)
        ]
        db.add_all(trustees)
        db.commit()

    # Check if Initiatives exist
    if db.query(models.Initiative).count() == 0:
        initiatives = [
            models.Initiative(
                title="Youth Empowerment & Skill Development",
                title_mr="युवा सक्षमीकरण आणि कौशल्य विकास",
                description="Equipping underprivileged youth with vocational skills, computer literacy, and career mentorship for independent livelihoods.",
                description_mr="गरजू युवकांना व्यावसायिक प्रशिक्षण, संगणक साक्षरता आणि स्वावलंबी जीवन जगण्यासाठी रोजगाराच्या संधी उपलब्ध करून देणे.",
                category="Youth & Education",
                icon="GraduationCap",
                image_url="/img1.jpeg",
                target_amount=150000.0,
                raised_amount=95000.0
            ),
            models.Initiative(
                title="Community Food & Ration Distribution",
                title_mr="अन्नदान व अन्नधान्य वाटप मोहीम",
                description="Providing nutritious meals and monthly ration kits to needy families, elderly persons, and daily-wage workers across Mumbai.",
                description_mr="मुंबईतील झोपडपट्टी भागातील गरीब व गरजू कुटुंबांना, ज्येष्ठ नागरिकांना दरमहा पोषण आहार व रेशन किट वाटप करणे.",
                category="Hunger Relief",
                icon="Utensils",
                image_url="/food_distribution.jpg",
                target_amount=200000.0,
                raised_amount=140000.0
            ),
            models.Initiative(
                title="Free Medical Checkups & Health Camps",
                title_mr="मोफत आरोग्य तपासणी व वैद्यकीय शिबिर",
                description="Organizing free health diagnostics, eye checkup camps, and providing essential medicines to vulnerable slum communities.",
                description_mr="झोपडपट्टी परिसरांमध्ये तज्ज्ञ डॉक्टरांच्या साहाय्याने मोफत आरोग्य तपासणी, औषध वाटप व नेत्र तपासणी शिबिरांचे आयोजन.",
                category="Healthcare",
                icon="HeartPulse",
                image_url="/healthcare_camp.jpg",
                target_amount=180000.0,
                raised_amount=115000.0
            ),
            models.Initiative(
                title="Women Support & Emergency Relief",
                title_mr="महिला सबलीकरण व आपत्कालीन मदत",
                description="Supporting women self-help initiatives, tailoring training, and urgent disaster relief assistance during times of crisis.",
                description_mr="महिला बचत गट मार्गदर्शन, शिवणकाम प्रशिक्षण आणि नैसर्गिक वा कौटुंबिक संकटात तातडीची आर्थिक व सामाजिक मदत.",
                category="Social Welfare",
                icon="Users",
                image_url="/women_empowerment.jpg",
                target_amount=120000.0,
                raised_amount=78000.0
            )
        ]
        db.add_all(initiatives)
        db.commit()

    # Seed an example donation if none exists
    if db.query(models.Donation).count() == 0:
        db.add(models.Donation(
            donor_name="Amit Shinde",
            donor_phone="+91 98200 12345",
            donor_email="amit@example.com",
            donor_pan="ABCDE1234F",
            amount=5000.0,
            payment_method="UPI",
            transaction_ref="UPI789123456",
            cause="Youth Empowerment & Skill Development",
            is_verified=True
        ))
        db.commit()

    # Seed HomeStat if none exists
    if db.query(models.HomeStat).count() == 0:
        db.add(models.HomeStat(
            stat1_number="100%",
            stat1_label="Community Dedicated",
            stat1_label_mr="समाजास समर्पित",
            stat2_number="50+",
            stat2_label="Active Social Workers",
            stat2_label_mr="सक्रिय समाजसेवक",
            stat3_number="10,000+",
            stat3_label="Families Impacted",
            stat3_label_mr="मदत पोहचलेली कुटुंबे"
        ))
        db.commit()
