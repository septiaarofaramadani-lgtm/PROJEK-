let transaksiList =
    JSON.parse(localStorage.getItem("dompetku_data")) || [];

let filterAktif = "semua";

const form = document.getElementById("form-transaksi");
const daftarEl = document.getElementById("daftar-transaksi");
const saldoEl = document.getElementById("total-saldo");
const pemasukanEl = document.getElementById("total-pemasukan");
const pengeluaranEl = document.getElementById("total-pengeluaran");

document.getElementById("tanggal").valueAsDate =
    new Date();

function formatRupiah(angka){
    return new Intl.NumberFormat("id-ID",{
        style:"currency",
        currency:"IDR",
        minimumFractionDigits:0
    }).format(angka);
}

function formatTanggal(tanggal){
    return new Date(tanggal).toLocaleDateString("id-ID",{
        day:"numeric",
        month:"long",
        year:"numeric"
    });
}

function simpanData(){
    localStorage.setItem(
        "dompetku_data",
        JSON.stringify(transaksiList)
    );
}

function renderAplikasi(){

    let pemasukan = 0;
    let pengeluaran = 0;

    transaksiList.forEach(item=>{

        if(item.tipe==="pemasukan"){
            pemasukan += item.jumlah;
        }else{
            pengeluaran += item.jumlah;
        }

    });

    const saldo = pemasukan - pengeluaran;

    saldoEl.textContent = formatRupiah(saldo);
    pemasukanEl.textContent = formatRupiah(pemasukan);
    pengeluaranEl.textContent = formatRupiah(pengeluaran);

    const data = transaksiList
        .filter(item=>{
            return filterAktif==="semua" ||
                   item.tipe===filterAktif;
        })
        .sort((a,b)=>
            new Date(b.tanggal) -
            new Date(a.tanggal)
        );

    daftarEl.innerHTML = "";

    if(data.length===0){

        daftarEl.innerHTML=`
        <div class="text-center text-gray-400 py-8">
            Belum ada transaksi
        </div>
        `;

        return;
    }

    data.forEach(item=>{

        const warna =
            item.tipe==="pemasukan"
                ? "text-emerald-600"
                : "text-rose-600";

        const tanda =
            item.tipe==="pemasukan"
                ? "+"
                : "-";

        const border =
            item.tipe==="pemasukan"
                ? "border-l-green-500"
                : "border-l-red-500";

        const card =
            document.createElement("div");

        card.className =
            `transaksi-item flex justify-between
             items-center p-3 rounded-lg
             bg-gray-50 border-l-4 ${border}`;

        card.innerHTML=`
        <div>
            <div class="font-semibold">
                ${item.keterangan}
            </div>

            <div class="text-xs text-gray-500">
                ${item.kategori}
            </div>

            <div class="text-xs text-gray-400">
                ${formatTanggal(item.tanggal)}
            </div>
        </div>

        <div class="flex items-center gap-3">

            <span class="${warna} font-bold">
                ${tanda}
                ${formatRupiah(item.jumlah)}
            </span>

            <button
                onclick="hapusTransaksi(${item.id})"
                class="text-red-500">
                ✕
            </button>

        </div>
        `;

        daftarEl.appendChild(card);
    });
}

form.addEventListener("submit",(e)=>{

    e.preventDefault();

    const transaksi = {

        id:Date.now(),

        tipe:
            document.querySelector(
                'input[name="tipe"]:checked'
            ).value,

        kategori:
            document.getElementById("kategori").value,

        jumlah:
            Number(
                document.getElementById("jumlah").value
            ),

        keterangan:
            document.getElementById("keterangan").value,

        tanggal:
            document.getElementById("tanggal").value
    };

    transaksiList.push(transaksi);

    simpanData();
    renderAplikasi();

    form.reset();

    document.getElementById("tanggal")
        .valueAsDate = new Date();
});

function hapusTransaksi(id){

    if(confirm("Hapus transaksi?")){

        transaksiList =
            transaksiList.filter(
                item=>item.id!==id
            );

        simpanData();
        renderAplikasi();
    }
}

function hapusSemuaData(){

    if(confirm("Hapus semua data?")){

        transaksiList=[];

        simpanData();
        renderAplikasi();
    }
}

function setFilter(filter){

    filterAktif = filter;

    document
        .querySelectorAll(".filter-btn")
        .forEach(btn =>
            btn.classList.remove("active")
        );

    document
        .getElementById(`filter-${filter}`)
        .classList.add("active");

    renderAplikasi();
}

renderAplikasi();
