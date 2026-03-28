/**
 * ScrollReveal — Fade-in + slide-up on scroll
 *
 * Uses IntersectionObserver. Animates once, then unobserves.
 *
 * Props:
 *   children
 *   delay     — optional delay in ms (for stagger effects)
 *   className — optional extra classes
 */
export const ScrollReveal = ({ children, delay = 0, className = '' }) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('reveal-visible');
          observer.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={delay ? { '--reveal-delay': `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
