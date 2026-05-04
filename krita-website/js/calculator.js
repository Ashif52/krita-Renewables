document.addEventListener('DOMContentLoaded', () => {
    const slider = document.getElementById('bill-slider');
    const propertySelect = document.getElementById('property-type');
    if (!slider) return;

    const displayBill = document.getElementById('bill-display');
    const resSize = document.getElementById('res-size');
    const resCost = document.getElementById('res-cost');
    const resSavings = document.getElementById('res-savings');
    const resPayback = document.getElementById('res-payback');

    // Cost per kWp by property type (in ₹)
    const COST_PER_KW = {
        industrial: 45000,
        commercial: 50000,
        residential: 55000
    };

    const TARIFF = 8; // ₹ per unit
    const UNITS_PER_KW_MONTH = 120; // avg monthly generation per kWp

    function fmt(n) {
        return new Intl.NumberFormat('en-IN').format(Math.round(n));
    }

    function calculate() {
        const bill = parseInt(slider.value);
        const type = propertySelect ? propertySelect.value : 'commercial';
        const costPerKw = COST_PER_KW[type] || 50000;

        // Units consumed per month
        const units = bill / TARIFF;
        // System size (kWp)
        let size = units / UNITS_PER_KW_MONTH;
        size = Math.ceil(size * 10) / 10;
        if (size < 1) size = 1;

        // Total cost
        const totalCost = size * costPerKw;
        // Savings (assuming ~100% offset)
        const yearlySavings = bill * 12;
        // Payback
        const payback = (totalCost / yearlySavings).toFixed(1);

        // Update DOM
        displayBill.textContent = fmt(bill);
        resSize.textContent = size + ' kWp';
        resCost.textContent = '₹' + fmt(totalCost);
        resSavings.textContent = '₹' + fmt(yearlySavings);
        resPayback.textContent = payback + ' Years';

        // Update slider track fill
        const pct = ((bill - 5000) / (500000 - 5000)) * 100;
        slider.style.background = `linear-gradient(90deg, var(--clr-primary) ${pct}%, #e2e8f0 ${pct}%)`;
    }

    slider.addEventListener('input', calculate);
    if (propertySelect) propertySelect.addEventListener('change', calculate);

    // Initial
    calculate();
});
