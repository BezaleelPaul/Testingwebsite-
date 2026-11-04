'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { animate, stagger } from 'animejs';

type TrackedElement = HTMLElement | SVGGeometryElement;

const readDelay = (element: HTMLElement) => {
  const value = Number(element.dataset.revealDelay || 0);
  return Number.isFinite(value) ? value : 0;
};

const formatCount = (value: number) => {
  const rounded = Math.round(value);
  return rounded >= 1000 ? rounded.toLocaleString('en-US') : String(rounded);
};

export const SiteMotion: React.FC = () => {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;
    root.dataset.motionBoot = 'on';

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    const activeAnimations: Array<{ revert: () => void }> = [];
    const observers: IntersectionObserver[] = [];

    const watch = (
      element: TrackedElement,
      onReveal: () => void,
      options?: IntersectionObserverInit
    ) => {
      if (!('IntersectionObserver' in window)) {
        onReveal();
        return;
      }

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);
          onReveal();
        });
      }, options);

      observer.observe(element);
      observers.push(observer);
    };

    document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((element) => {
      const animation = animate(element, {
        opacity: [0, 1],
        translateY: ['1.55rem', '0rem'],
        duration: 920,
        delay: readDelay(element),
        ease: 'out(3)',
        autoplay: false,
      });

      activeAnimations.push(animation);
      watch(element, () => animation.play());
    });

    document.querySelectorAll<HTMLElement>('[data-reveal-group]').forEach((group) => {
      const items = Array.from(group.querySelectorAll<HTMLElement>('[data-reveal-item]'));
      if (items.length === 0) return;

      const animation = animate(items, {
        opacity: [0, 1],
        translateY: ['1.35rem', '0rem'],
        duration: 820,
        delay: stagger(72, { start: readDelay(group) }),
        ease: 'out(3)',
        autoplay: false,
      });

      activeAnimations.push(animation);
      watch(group, () => animation.play(), { threshold: 0.08 });
    });

    document.querySelectorAll<HTMLElement>('[data-word-group]').forEach((group) => {
      const words = Array.from(group.querySelectorAll<HTMLElement>('[data-word-reveal]'));
      if (words.length === 0) return;

      const animation = animate(words, {
        opacity: [0, 1],
        translateY: ['115%', '0%'],
        duration: 980,
        delay: stagger(58, { start: readDelay(group) }),
        ease: 'out(4)',
        autoplay: false,
      });

      activeAnimations.push(animation);
      watch(group, () => animation.play(), { threshold: 0.18 });
    });

    document.querySelectorAll<HTMLElement>('[data-count]').forEach((element) => {
      const target = Number(element.dataset.count);
      if (!Number.isFinite(target)) return;

      watch(element, () => {
        const counter = { value: 0 };
        const animation = animate(counter, {
          value: target,
          duration: 1350,
          ease: 'out(3)',
          onUpdate: () => {
            element.textContent = formatCount(counter.value);
          },
        });
        activeAnimations.push(animation);
      });
    });

    document.querySelectorAll<SVGGeometryElement>('[data-draw]').forEach((element) => {
      if (typeof element.getTotalLength !== 'function') return;

      const length = element.getTotalLength();
      element.style.strokeDasharray = String(length);
      element.style.strokeDashoffset = String(length);

      watch(element, () => {
        const animation = animate(element, {
          strokeDashoffset: [length, 0],
          duration: 1650,
          ease: 'inOut(2)',
        });
        activeAnimations.push(animation);
      }, { threshold: 0.1 });
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
      activeAnimations.forEach((animation) => animation.revert());
    };
  }, [pathname]);

  return null;
};
