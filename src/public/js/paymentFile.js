console.log('connected');

const buyBtn = document.querySelector('#buyBtn');

buyBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const amount = document.querySelector('.amount').innerText.split(' ').pop();
    makePayment(amount);

})


async function makePayment(amount) {
    try {
        const res = await axios({
            method: 'post',
            url: '/order',
            data: { amount },
            headers: { 'X-Requested-With': 'XMLHttpRequest' }
        })
        options = {
            "key": "rzp_test_8wvQsvdLHaDloc", // Enter the Key ID generated from the Dashboard
            "amount": res.data.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            "currency": "INR",
            "name": "E-Commerce", //our company name
            "description": "Test Transaction",
            "image": "/assets/logo.png", //logo image
            "order_id": res.data.order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
            "callback_url": "http://localhost:4000/payment-verify",
            "notes": {
                "address": "Razorpay Corporate Office" //any address
            },
            "theme": {
                "color": "#008000"
            }

        };
        var rzpay = new Razorpay(options)
        rzpay.open();
    } catch (error) {
        console.log(error);
    }
}