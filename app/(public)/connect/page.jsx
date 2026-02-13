import Connect from '@/components/Connect';
import Footer from '@/components/footer';

export const metadata = {
    title: "Connect",
    description:
        "Get in touch with TrendyStory for collaborations, partnerships, and AI workflow support.",
    keywords: [
        "ai consulting for small business",
        "ai automation consulting",
        "business workflow consulting",
        "ai implementation support",
        "ai strategy for startups",
        "contact trendystory",
    ],
    alternates: {
        canonical: "/connect",
    },
};

export default function ConnectUs() {
    return (
        <>
            {/* <Navbar isScrolled={false} /> */}
            <Connect />
            <Footer />
        </>
    )
}
