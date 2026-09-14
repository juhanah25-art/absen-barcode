
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({
      success: true,
      message: "Sistem Absensi Guru SDN Cikampek Barat 2 aktif"
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents || "{}");
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetGuru = ss.getSheetByName("Data Guru");
    const sheetHadir = ss.getSheetByName("Kehadiran");

    if (!sheetGuru || !sheetHadir) {
      return jsonResponse({
        success: false,
        message: 'Pastikan sheet "Data Guru" dan "Kehadiran" tersedia.'
      });
    }

    // Ambil semua data guru untuk dipakai website.
    if (data.action === "getGuru") {
      const values = sheetGuru.getDataRange().getValues();
      const guru = values.slice(1)
        .filter(row => row[0] !== "")
        .map(row => ({
          id: row[0],
          nama: row[1],
          jabatan: row[2],
          status: row[3]
        }));

      return jsonResponse({success:true, data:guru});
    }

    // Simpan guru baru dari website ke Google Sheets.
    if (data.action === "saveGuru") {
      const guru = data.guru || {};
      if (!guru.id || !guru.nama) {
        return jsonResponse({success:false, message:"ID dan nama guru wajib diisi."});
      }

      const values = sheetGuru.getDataRange().getValues();
      for (let i = 1; i < values.length; i++) {
        if (String(values[i][0]) === String(guru.id)) {
          return jsonResponse({success:false, message:"ID Guru sudah ada."});
        }
      }

      sheetGuru.appendRow([
        guru.id,
        guru.nama,
        guru.jabatan || "Guru",
        guru.status || "Aktif"
      ]);

      return jsonResponse({success:true, message:"Guru berhasil disimpan."});
    }

    // Simpan absensi dari website.
    if (data.action === "absen") {
      const idGuru = String(data.idGuru || "");
      if (!idGuru) {
        return jsonResponse({success:false, message:"ID Guru kosong."});
      }

      const values = sheetGuru.getDataRange().getValues();
      let guru = null;

      for (let i = 1; i < values.length; i++) {
        if (String(values[i][0]) === idGuru) {
          guru = {
            id: values[i][0],
            nama: values[i][1],
            jabatan: values[i][2],
            status: values[i][3]
          };
          break;
        }
      }

      if (!guru) {
        return jsonResponse({success:false, message:"ID Guru tidak ditemukan."});
      }

      const sekarang = new Date();
      const tanggal = Utilities.formatDate(
        sekarang, Session.getScriptTimeZone(), "yyyy-MM-dd"
      );
      const jam = Utilities.formatDate(
        sekarang, Session.getScriptTimeZone(), "HH:mm:ss"
      );

      const hadir = sheetHadir.getDataRange().getValues();

      for (let i = 1; i < hadir.length; i++) {
        let tanggalSheet = hadir[i][0];
        if (tanggalSheet instanceof Date) {
          tanggalSheet = Utilities.formatDate(
            tanggalSheet, Session.getScriptTimeZone(), "yyyy-MM-dd"
          );
        } else {
          tanggalSheet = String(tanggalSheet);
        }

        if (tanggalSheet === tanggal && String(hadir[i][2]) === idGuru) {
          return jsonResponse({
            success:false,
            message:guru.nama + " sudah melakukan absensi hari ini."
          });
        }
      }

      sheetHadir.appendRow([
        tanggal,
        jam,
        guru.id,
        guru.nama,
        "Hadir",
        ""
      ]);

      return jsonResponse({
        success:true,
        message:"Absensi berhasil.",
        data:{
          tanggal: tanggal,
          jam: jam,
          idGuru: guru.id,
          nama: guru.nama,
          status:"Hadir"
        }
      });
    }

    return jsonResponse({
      success:false,
      message:"Action tidak dikenali."
    });

  } catch (error) {
    return jsonResponse({
      success:false,
      message:String(error)
    });
  }
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
