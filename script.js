document.addEventListener("DOMContentLoaded", () => {
  const lenis = new Lenis();
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  const cards = gsap.utils.toArray(".card");
  const rotations = [-12, 10, -5, 5, -5, -2];
  const yOffset = -200; // Przesunięcie kart wyżej o 200px

  cards.forEach((card, index) => {
    gsap.set(card, {
      y: window.innerHeight + yOffset, // Uwzględnienie przesunięcia
      rotate: rotations[index],
    });
  });

  ScrollTrigger.create({
    trigger: ".sticky-cards",
    start: "top top",
    end: `+=${window.innerHeight * 8}px`,
    pin: true,
    pinSpacing: true,
    scrub: 1,
    onUpdate: (self) => {
      const progress = self.progress;
      const totalCards = cards.length;
      const progressPerCard = 1 / totalCards;

      cards.forEach((card, index) => {
        const cardStart = index * progressPerCard;
        let cardProgress = (progress - cardStart) / progressPerCard;
        cardProgress = Math.min(Math.max(cardProgress, 0), 1);

        let yPos = window.innerHeight * (1 - cardProgress) + yOffset; // Uwzględnienie przesunięcia
        let xPos = 0;

        if (cardProgress === 1 && index < totalCards - 1) {
          const remainingProgress =
            (progress - (cardStart + progressPerCard)) /
            (1 - (cardStart + progressPerCard));

          if (remainingProgress > 0) {
            const distanceMultiplier = 1 - index * 0.15;
            xPos =
              -window.innerHeight *
              0.3 *
              distanceMultiplier *
              remainingProgress;
            yPos =
              -window.innerHeight *
                0.3 *
                distanceMultiplier *
                remainingProgress +
              yOffset; // Przesunięcie tutaj także
          }
        }

        gsap.to(card, {
          y: yPos,
          x: xPos,
          duration: 0,
          ease: "none",
        });
      });
    },
  });
});
