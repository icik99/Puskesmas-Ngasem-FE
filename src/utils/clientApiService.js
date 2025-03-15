import request from './requestClient';

class ClientRequest {
  static urlAPI = process.env.NEXT_PUBLIC_BACKEND_LOCAL;

  static GetProfile = (token) => {
    const path = `api/users/profile`;
    return request(`${this.urlAPI}${path}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  static Login = (token, data) => {
    const path = `login`;
    return request(`${this.urlAPI}${path}`, {
      method: 'POST',
      data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
  static Register = (data) => {
    const path = `register`;
    return request(`${this.urlAPI}${path}`, {
      method: 'POST',
      data,
    });
  };

  //File

  static CreateFile = (data, token) => {
    const path = `api/file/upload`;
    return request(`${this.urlAPI}${path}`, {
      method: 'POST',
      data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
  static UpdateFile = (data, id, token) => {
    const path = `api/file/${id}`;
    return request(`${this.urlAPI}${path}`, {
      method: 'PUT',
      data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
  static DeleteFile = (id, token) => {
    const path = `api/file/delete/${id}`;
    return request(`${this.urlAPI}${path}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
  static GetFileById = (token, id) => {
    const path = `api/file/${id}`;
    return request(`${this.urlAPI}${path}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  // User Management
  static CreateUser = (data, token) => {
    const path = `userManagementAdmin/createUser`;
    return request(`${this.urlAPI}${path}`, {
      method: 'POST',
      data,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
  };
  static UpdateUser = (data, id, token) => {
    const path = `userManagementAdmin/updateUserById/${id}`;
    return request(`${this.urlAPI}${path}`, {
      method: 'PUT',
      data,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
  };
  static DeleteUser = (id, token) => {
    const path = `userManagementAdmin/deleteUser/${id}`;
    return request(`${this.urlAPI}${path}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
  static GetUser = (token, keyword, limit, page) => {
    const path = `userManagementAdmin/getUser?page=${page}&limit=${limit}&keyword=${keyword}`;
    return request(`${this.urlAPI}${path}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
  static GetUserById = (token, id) => {
    const path = `userManagementAdmin/getUserById/${id}`;
    return request(`${this.urlAPI}${path}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  // Province
  static CreateProvince = (data, token) => {
    const path = `api/province`;
    return request(`${this.urlAPI}${path}`, {
      method: 'POST',
      data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
  static UpdateProvince = (data, id, token) => {
    const path = `api/province/${id}`;
    return request(`${this.urlAPI}${path}`, {
      method: 'PUT',
      data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
  static DeleteProvince = (id, token) => {
    const path = `api/province/${id}`;
    return request(`${this.urlAPI}${path}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
  static GetProvince = (token, keyword, limit, page) => {
    const path = `api/province?page=${page}&limit=${limit}&keyword=${keyword}`;
    return request(`${this.urlAPI}${path}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
  static GetProvinceById = (token, id) => {
    const path = `api/province/${id}`;
    return request(`${this.urlAPI}${path}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  // Pasien
  static CreatePatient = (data, token) => {
    const path = `pasienManagement/createPasien`;
    return request(`${this.urlAPI}${path}`, {
      method: 'POST',
      data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
  static UpdatePatient = (data, id, token) => {
    const path = `pasienManagement/updatePasienById/${id}`;
    return request(`${this.urlAPI}${path}`, {
      method: 'PUT',
      data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
  static DeletePatient = (id, token) => {
    const path = `pasienManagement/deletePasien/${id}`;
    return request(`${this.urlAPI}${path}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
  static GetPatient = (token, keyword, limit, page) => {
    const path = `pasienManagement/getPasien?page=${page}&limit=${limit}&namaPasien=${keyword}`;
    return request(`${this.urlAPI}${path}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
  
  static GetPatientById = (token, id) => {
    const path = `pasienManagement/getPasienById/${id}`;
    return request(`${this.urlAPI}${path}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  // Rekam Medis
  static CreateRekamMedis = (data, token) => {
    const path = `rekamMedis/createRekamMedis`;
    return request(`${this.urlAPI}${path}`, {
      method: 'POST',
      data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
  static UpdateRekamMedis = (data, id, token) => {
    const path = `rekamMedis/updateRekamMedisById/${id}`;
    return request(`${this.urlAPI}${path}`, {
      method: 'PUT',
      data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
  static DeleteRekamMedis = (id, token) => {
    const path = `rekamMedis/deleteRekamMedis/${id}`;
    return request(`${this.urlAPI}${path}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
  static GetRekamMedis = (token, keyword, limit, page) => {
    const path = `rekamMedis/getRekamMedis?page=${page}&limit=${limit}&namaPasien=${keyword}`;
    return request(`${this.urlAPI}${path}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
  
  static GetRekamMedisById = (token, id) => {
    const path = `rekamMedis/getRekamMedisById/${id}`;
    return request(`${this.urlAPI}${path}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };


  // PeminjamanRekam Medis
  static CreatePeminjamanRekamMedis = (data, token) => {
    const path = `peminjamanRekamMedis/createPeminjamanRekamMedis`;
    return request(`${this.urlAPI}${path}`, {
      method: 'POST',
      data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
  static UpdatePeminjamanRekamMedis = (data, id, token) => {
    const path = `peminjamanRekamMedis/updatePeminjamanRekamMedisById/${id}`;
    return request(`${this.urlAPI}${path}`, {
      method: 'PUT',
      data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
  static UpdateStatusPeminjamanRekamMedis = (data, id, token) => {
    const path = `peminjamanRekamMedis/updateStatusPeminjamanRekamMedis/${id}`;
    return request(`${this.urlAPI}${path}`, {
      method: 'PUT',
      data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
  static DeletePeminjamanRekamMedis = (id, token) => {
    const path = `peminjamanRekamMedis/deletePeminjamanRekamMedis/${id}`;
    return request(`${this.urlAPI}${path}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
  static GetPeminjamanRekamMedis = (token, keyword, limit, page) => {
    const path = `peminjamanRekamMedis/getPeminjamanRekamMedis?page=${page}&limit=${limit}&status=${keyword}`;
    return request(`${this.urlAPI}${path}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
  
  static GetPeminjamanRekamMedisById = (token, id) => {
    const path = `peminjamanRekamMedis/getPeminjamanRekamMedisById/${id}`;
    return request(`${this.urlAPI}${path}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  static GetDokter = (token, keyword, limit, page) => {
    const path = `userManagementAdmin/getDokter?page=${page}&limit=${limit}&namaPasien=${keyword}`;
    return request(`${this.urlAPI}${path}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  static GetCountDashboard = (token) => {
    const path = `countDashboard`;
    return request(`${this.urlAPI}${path}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  static GetLogActivity = (token) => {
    const path = `logActivity/get-log-activity`;
    return request(`${this.urlAPI}${path}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  static GetAnalisisRekamMedis = (token, keyword, limit, page) => {
    const path = `rekamMedis/analisis-rekam-medis`;
    return request(`${this.urlAPI}${path}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  static CheckRekamMedisStatus = (token) => {
    const path = `checkStatuspeminjamanRekamMedis/check-rekam-medis-status`;
    return request(`${this.urlAPI}${path}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
  
}


export default ClientRequest;
