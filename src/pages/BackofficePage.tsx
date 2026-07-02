import { useState, useMemo } from 'react';
import { Download, Search, Filter, Plus } from 'lucide-react';
import { useOrders } from '../hooks/useOrders';
import { useUpdateOrderStatus } from '../hooks/useUpdateOrderStatus';
import { getOrderTotal } from '../api/orders';
import { formatPrice, formatDate, exportOrdersToXlsx } from '../utils/helpers';
import { Select } from '../components/ui/Select';
import { OrderItemsModal } from '../components/backoffice/OrderItemsModal';
import { AddBookModal } from '../components/backoffice/AddBookModal';
import { useToast } from '../context/ToastContext';
import {
  orderStatusLabels,
  orderStatusOptions,
} from '../constants/orderStatus';
import type { ApiOrderDetail } from '../types/api';
import './BackofficePage.css';

export function BackofficePage() {
  const { data: orders = [], isLoading } = useOrders();
  const { mutate: updateStatus, isPending: isUpdatingStatus, variables } = useUpdateOrderStatus();
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [provinceFilter, setProvinceFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<ApiOrderDetail | null>(null);
  const [isAddBookOpen, setIsAddBookOpen] = useState(false);

  const provinces = useMemo(() => {
    const values = orders
      .map((order) => order.customer.location.split(',')[0]?.trim())
      .filter(Boolean);
    return [...new Set(values)].sort();
  }, [orders]);

  const statusOptions = useMemo(() => {
    const statuses = new Set([
      ...orderStatusOptions.map((option) => option.value),
      ...orders.map((order) => order.status),
    ]);

    return [...statuses].sort().map((status) => ({
      value: status,
      label: orderStatusLabels[status] ?? status,
    }));
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const query = search.toLowerCase().trim();
    return orders.filter((order) => {
      const matchesSearch =
        !query ||
        String(order.id).includes(query) ||
        order.customer.fullName.toLowerCase().includes(query) ||
        order.customer.phone.includes(query);
      const matchesProvince =
        !provinceFilter || order.customer.location.includes(provinceFilter);
      const matchesStatus = !statusFilter || order.status === statusFilter;
      return matchesSearch && matchesProvince && matchesStatus;
    });
  }, [orders, search, provinceFilter, statusFilter]);

  const handleExport = () => {
    exportOrdersToXlsx(
      orders.map((order) => ({
        id: order.id,
        customer: order.customer,
        pickupPost: order.pickupPost,
        total: getOrderTotal(order),
        status: order.status,
        createAt: order.createAt,
        items: order.items,
      })),
    );
  };

  const handleStatusChange = (order: ApiOrderDetail, status: string) => {
    if (!status || status === order.status) return;

    updateStatus(
      { order, status },
      {
        onSuccess: (updatedOrder) => {
          if (selectedOrder?.id === updatedOrder.id) {
            setSelectedOrder(updatedOrder);
          }
          showToast('Estado da encomenda atualizado.');
        },
        onError: () => {
          showToast('Não foi possível atualizar o estado da encomenda.', 'error');
        },
      },
    );
  };

  const closeModal = () => setSelectedOrder(null);

  return (
    <div className="backoffice-page">
      <div className="backoffice-header">
        <div className="container">
          <div className="backoffice-header-row">
            <div>
              <h1 className="section-title">Backoffice — Encomendas</h1>
              <p className="section-subtitle">
                Gestão de pedidos da campanha Bom Regresso às Aulas 2026.
              </p>
            </div>
            <button
              className="btn btn-primary"
              onClick={handleExport}
              disabled={orders.length === 0}
            >
              <Download size={18} />
              Exportar Excel
            </button>
          </div>
        </div>
      </div>

      <div className="container backoffice-body">

        {isLoading ? (
          <div className="backoffice-empty">
            <p>A carregar encomendas...</p>
          </div>
        ) : (
          <>
            <div className="backoffice-stats">
              <div className="stat-card">
                <span className="stat-value">{orders.length}</span>
                <span className="stat-label">Total Encomendas</span>
              </div>
              <div className="stat-card">
                <span className="stat-value">
                  {orders.filter((o) => o.status === 'PENDING').length}
                </span>
                <span className="stat-label">Pendentes</span>
              </div>
              <div className="stat-card">
                <span className="stat-value">
                  {formatPrice(orders.reduce((sum, order) => sum + getOrderTotal(order), 0))}
                </span>
                <span className="stat-label">Volume Total</span>
              </div>
            </div>

            <div className="backoffice-filters">
              <div className="backoffice-search">
                <Search size={18} />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Pesquisar por ID, cliente ou telefone..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="backoffice-filter-group">
                <Filter size={16} />
                <Select
                  value={provinceFilter}
                  onChange={setProvinceFilter}
                  placeholder="Todas as localizações"
                  options={provinces.map((p) => ({ value: p, label: p }))}
                />
                <Select
                  value={statusFilter}
                  onChange={setStatusFilter}
                  placeholder="Todos os estados"
                  options={statusOptions}
                />
              </div>
            </div>

            <div className="backoffice-toolbar">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setIsAddBookOpen(true)}
              >
                <Plus size={18} />
                Adicionar livro
              </button>
            </div>

            {filteredOrders.length > 0 ? (
              <div className="backoffice-table-wrap">
                <table className="backoffice-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Cliente</th>
                      <th>Contacto</th>
                      <th>Posto</th>
                      <th>Livros</th>
                      <th>Total</th>
                      <th>Estado</th>
                      <th>Data</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => {
                      const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
                      const isUpdatingThisOrder =
                        isUpdatingStatus && variables?.order.id === order.id;

                      return (
                        <tr key={order.id}>
                          <td className="mono">{order.id}</td>
                          <td>{order.customer.fullName}</td>
                          <td>
                            <div className="contact-cell">
                              <span>{order.customer.phone}</span>
                              <span className="contact-email">{order.customer.email}</span>
                            </div>
                          </td>
                          <td>{order.pickupPost}</td>
                          <td>{itemCount}</td>
                          <td className="price">{formatPrice(getOrderTotal(order))}</td>
                          <td className="backoffice-status-cell">
                            <Select
                              className="backoffice-status-select"
                              value={order.status}
                              onChange={(status) => handleStatusChange(order, status)}
                              options={statusOptions}
                              disabled={isUpdatingThisOrder}
                              clearable={false}
                              placeholder={orderStatusLabels[order.status] ?? order.status}
                            />
                          </td>
                          <td className="date">{formatDate(order.createAt)}</td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-outline btn-sm"
                              onClick={() => setSelectedOrder(order)}
                            >
                              Ver itens
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="backoffice-empty">
                <p>
                  {orders.length === 0
                    ? 'Ainda não existem encomendas.'
                    : 'Nenhuma encomenda corresponde aos filtros.'}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      <OrderItemsModal
        isOpen={selectedOrder !== null}
        onClose={closeModal}
        order={selectedOrder}
      />

      <AddBookModal
        isOpen={isAddBookOpen}
        onClose={() => setIsAddBookOpen(false)}
      />
    </div>
  );
}
