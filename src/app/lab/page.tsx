import Link from 'next/link';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { RobotArmLab } from '@/components/robotics/RobotArmLab';

export default function RoboticsLabPage() {
  return (
    <div className="robotics-page">
      <Navbar />
      <main className="robotics-page-main">
        <div className="site-shell">
          <Link href="/" className="universe-back-link"><ArrowLeft size={14} /> RETURN TO PORTFOLIO</Link>
          <header className="robotics-page-heading">
            <p className="orbital-eyebrow"><span>02</span> / INTERACTIVE ENGINEERING LAB</p>
            <h1>MECHANICS<br /><span>IN MOTION.</span></h1>
            <p>Meet ATLAS-01: an original transformable robotics prototype. Switch between bipedal mech and rover configurations, power the reactor, and tune its three-axis manipulator.</p>
          </header>
          <RobotArmLab />
          <div className="robotics-page-footer">
            <span>THREE.JS / REACT THREE FIBER / TRANSFORMABLE MECH</span>
            <Link href="/universe/">EXPLORE THE UNIVERSE <ArrowUpRight size={14} /></Link>
          </div>
        </div>
      </main>
    </div>
  );
}
